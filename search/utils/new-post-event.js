const Search = require("../models/searchPostSchema");
const logger = require("./logger");

async function handlePostCreated(event) {
    const datfromNewPost=JSON.parse(event);
  try {
    const newSearchPost = new Search({
      postId: datfromNewPost.postId,
      userId: datfromNewPost.userId,
      content: datfromNewPost.content,
      createdAt: datfromNewPost.createdAt,
    });

    await newSearchPost.save();
    logger.info(
      `Search post created: ${datfromNewPost.postId}, ${newSearchPost._id.toString()}`
    );
  } catch (e) {
    logger.error(e, "Error handling post creation event");
  }
}

async function handlePostDeleted(event) {
    console.log("here inside deete post");
  try {
    const datafromPost=JSON.parse(event);
    await Search.findOneAndDelete({ postId: datafromPost.postId });
    logger.info(`Search post deleted: ${datafromPost.postId}}`);
  } catch (error) {
    logger.error(error, "Error handling post deletion event");
  }
}

module.exports = { handlePostCreated, handlePostDeleted };