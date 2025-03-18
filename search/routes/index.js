const express = require("express");
const { searchPostController } = require("../controllers/index");
const { authenticateRequest } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateRequest);

router.get("/posts", searchPostController);

module.exports = router;