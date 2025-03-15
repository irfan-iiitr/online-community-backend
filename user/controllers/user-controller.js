const RefreshToken = require("../models/refresh-token");
const User = require("../models/Users");
const generateTokens = require("../utils/token-generator");
const logger = require("../utils/logger");
const { validateRegsiterationData,validateloginData } = require("../utils/validation");


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

const loginUser = async (req, res) => {
  logger.info("Inside Login Controller");
  try {
    const { error } = validateloginData(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });
    
    if (!(await user.comparePassword(password))) return res.status(400).json({ success: false, message: "Invalid password" });
    
    const { token, refreshToken } = await generateTokens(user);
    console.log(token,refreshToken);
    res.json({ token, refreshToken, userId: user._id });
  } catch (e) {
    logger.error("Login error occurred", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const refreshToken = async (req, res) => {
  logger.info("Inside Refresh token controller");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: "Refresh token missing" });

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken || storedToken.expiresAt < new Date()) 
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });

    const user = await User.findById(storedToken.user);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(user);
    await RefreshToken.deleteOne({ _id: storedToken._id });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (e) {
    logger.error("Refresh token error occurred", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: "Refresh token missing" });

    await RefreshToken.deleteOne({ token: refreshToken });
    logger.info("Refresh token deleted for logout");

    res.json({ success: true, message: "Logged out successfully!" });
  } catch (e) {
    logger.error("Error while logging out", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




module.exports={registerUser,loginUser,refreshToken,logoutUser};