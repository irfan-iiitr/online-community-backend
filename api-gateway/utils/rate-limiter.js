const redisClient = require("./redis-client");

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip; // Identify the user by IP
    const key = `rate-limit:${ip}`;
    const windowMs = 15* 60; // 15 minutes
    const maxRequests = 100; // Max allowed requests

    const requestCount = (await redisClient.get(key)) || 0;
    
    console.log("request count",requestCount);

    if (requestCount >= maxRequests) {
      return res.status(429).json({ success: false, message: "Too many requests" });
    }

    await redisClient.incr(key);
    if (requestCount == 0) await redisClient.expire(key, windowMs);

    next(); // Allow the request to proceed
  } catch (error) {
    console.error("Rate Limiter Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = rateLimiter;
