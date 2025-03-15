const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    console.log(req.headers["authorization"])
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Authentication required", success: false });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(429).json({ message: "Invalid token!", success: false });

    req.user = user;
    req.headers["x-user-id"] =user.userId;
    next();
  });
};

module.exports = { validateToken };
