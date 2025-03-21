const Post = require("../models/Post");
const { validateCreatePost } = require("../utils/validation");
const logger= require('../utils/logger');
const { publishToQueue } = require("../utils/rabbit");

const  {redisClient} =require("../utils/redis-client");

async function invalidatePostCache(input) {
  const cachedKey = `post:${input}`;
  await redisClient.del(cachedKey);

  const keys = await redisClient.keys("posts:*");
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}


const createPost = async (req, res) => {
    logger.info("Creating a Post.....");
    try {
      const { error } = validateCreatePost(req.body);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  
      const { content, mediaIds = [] } = req.body;
      const newlyCreatedPost = new Post({ user: req.user.userId, content, mediaIds });
  
      await newlyCreatedPost.save();
      const newPostStreamData={
        postId:newlyCreatedPost._id.toString(),
        userId:newlyCreatedPost.user.toString(),
        content:newlyCreatedPost.content,
        createdAt:newlyCreatedPost.createdAt,
      }

      publishToQueue("new-post",JSON.stringify(newPostStreamData)); 

      await invalidatePostCache(newlyCreatedPost._id.toString());

      logger.info("Post created successfully", newlyCreatedPost);
      res.status(201).json({ success: true, message: "Post created successfully" });
    } catch (e) {
      logger.error("Error creating post", e);
      res.status(500).json({ success: false, message: "Error creating post" });
    }
};

const getAllPosts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const cacheKey = `posts:${page}:${limit}`;
      const cachedPosts = await redisClient.get(cacheKey);
  
      if (cachedPosts) {
        console.log("returning from cache");
        return res.json(JSON.parse(cachedPosts));
      }
  
      const posts = await Post.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit); //skip how many initial page
      const totalNoOfPosts = await Post.countDocuments();
      const result = { posts, currentpage: page, totalPages: Math.ceil(totalNoOfPosts / limit), totalPosts: totalNoOfPosts };
      
      await redisClient.setex(cacheKey, 300, JSON.stringify(result)); // Set the cache for the given key (cacheKey) with a 300-second expiration time, storing the JSON stringified 'result' object.


      res.json(result);
    } catch (e) {
      logger.error("Error fetching posts", e);
      res.status(500).json({ success: false, message: "Error fetching posts" });
    }
  };
  
  const getPost = async (req, res) => {
    try {
      const postId = req.params.id;
      const cachekey = `post:${postId}`;
      const cachedPost = await redisClient.get(cachekey);
      console.log(cachekey,cachedPost);
      if (cachedPost) {
        console.log("recieving from cache");
        return res.json(JSON.parse(cachedPost));
      }
  
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found", success: false });

      await redisClient.setex(
        cachekey,
        3600,
        JSON.stringify(post)
      );
  
      res.json(post);
    } catch (e) {
      logger.error("Error fetching post", e);
      res.status(500).json({ success: false, message: "Error fetching post by ID" });
    }
  };
  
  const deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!post) return res.status(404).json({ message: "Post not found", success: false });

        const messagePayload = {
            postId: post._id,
            userId: req.user.userId,
            contentIds: post.mediaIds
        };

        logger.info('Publishing delete-post message', messagePayload);
         
        await  publishToQueue("deletePost", JSON.stringify(messagePayload));

        logger.info('Successfully published delete-post message');

        await invalidatePostCache(req.params.id);

        res.json({ message: "Post deleted successfully" });
    } catch (e) {
        logger.error("Error deleting post", e);
        res.status(500).json({ success: false, message: "Error deleting post" });
    }
};
  
  module.exports = { createPost, getAllPosts, getPost, deletePost };
  
  