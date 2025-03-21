const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");
const helmet = require("helmet");

const dotenv=require('dotenv');
dotenv.config();

const errorHandler = require("./middleware/error-handler");
const logger = require("./utils/logger");
const proxy = require("express-http-proxy");
const { validateToken } = require("./middleware/validate-token");

const requiredEnvVars = ['USER_SERVICE_URL', 'POST_SERVICE_URL', 'CONTENT_SERVICE_URL', 'SEARCH_SERVICE_URL'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        logger.error(`Environment variable ${envVar} is not set.`);
        process.exit(1);
    }
});

const rateLimiter=require('./utils/rate-limiter');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
});

app.use(errorHandler);

app.use('/user',proxy(process.env.USER_SERVICE_URL));
app.use('/post/',validateToken,proxy(process.env.POST_SERVICE_URL));
app.use('/content/', validateToken, proxy(process.env.CONTENT_SERVICE_URL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // Forward content-type to ensure multipart is handled correctly
        proxyReqOpts.headers = {
            ...proxyReqOpts.headers,
            'Content-Type': srcReq.headers['content-type'] || 'application/json',
        };
        return proxyReqOpts;
    },
    proxyReqBodyDecorator: (bodyContent, srcReq) => {
        // Skip body processing for multipart/form-data
        if (srcReq.headers['content-type']?.startsWith('multipart/form-data')) {
            return bodyContent; // Let proxy handle it
        }
        return bodyContent;
    },
    parseReqBody: false // Important: Prevents express-http-proxy from interfering with file streams
}));

app.use('/search/',validateToken,proxy(process.env.SEARCH_SERVICE_URL));

app.use('/ping',(req,res)=>{
    console.log("ping");
    res.json({msg:"Pong"});
})


app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
    logger.info(`User Service URL: ${process.env.USER_SERVICE_URL}`);
    logger.info(`Post Service URL: ${process.env.POST_SERVICE_URL}`);
    logger.info(`Content Service URL: ${process.env.CONTENT_SERVICE_URL}`);
    logger.info(`Search Service URL: ${process.env.SEARCH_SERVICE_URL}`);
});









