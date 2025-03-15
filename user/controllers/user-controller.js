const RefreshToken = require("../models/refresh-token");
const User = require("../models/Users");
const generateTokens = require("../utils/token-generator");
const logger = require("../utils/logger");
const { validateRegsiterationData } = require("../utils/validation");


const registerUser = async (req, res) => {
  logger.info("Registration Controller function started");
  try {


    //validate the schema
    const { error } = validateRegsiterationData(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }



    const { email, password, username } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });



    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ username, email, password });
    await user.save();
    logger.info("User saved successfully", user._id);

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      refreshToken,
    });


  } catch (e) {
    logger.error("Registration error occured", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports={registerUser};