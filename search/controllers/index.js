const Search = require("../models/searchPostSchema");
const logger = require("../utils/logger");

const searchPostController = async (req, res) => {
  logger.info("Search endpoint hit!");
  try {
    const results = await Search.find(
      { $text: { $search: req.query.query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).limit(10);

    res.json(results);
  } catch (error) {
    logger.error("Error while searching post", error);
    res.status(500).json({ success: false, message: "Error while searching post" });
  }
};

module.exports = { searchPostController };
