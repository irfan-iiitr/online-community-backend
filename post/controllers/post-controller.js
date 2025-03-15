const Post = require("../models/Post");
const { validateCreatePost } = require("../utils/validation");
const logger= require('../utils/logger')


const createPost = async (req, res) => {
    logger.info("Creating a Post.....");
    try {
      const { error } = validateCreatePost(req.body);
      if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  
      const { content, mediaIds = [] } = req.body;
      const newlyCreatedPost = new Post({ user: req.user.userId, content, mediaIds });
  
      await newlyCreatedPost.save();


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
  
      const posts = await Post.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit); //skip how many initial page
      const totalNoOfPosts = await Post.countDocuments();
      const result = { posts, currentpage: page, totalPages: Math.ceil(totalNoOfPosts / limit), totalPosts: totalNoOfPosts };
  
      res.json(result);
    } catch (e) {
      logger.error("Error fetching posts", e);
      res.status(500).json({ success: false, message: "Error fetching posts" });
    }
  };
  
  const getPost = async (req, res) => {
    try {
      const postId = req.params.id;
  
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found", success: false });
  
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
  
      res.json({ message: "Post deleted successfully" });
    } catch (e) {
      logger.error("Error deleting post", e);
      res.status(500).json({ success: false, message: "Error deleting post" });
    }
  };
  
  module.exports = { createPost, getAllPosts, getPost, deletePost };
  
  