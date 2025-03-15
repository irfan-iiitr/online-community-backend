
const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");
const helmet = require("helmet");

const dotenv=require('dotenv');
dotenv.config();

const errorHandler = require("./middleware/error-handler");
const logger = require("./utils/logger");
const proxy = require("express-http-proxy");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
});

app.use(errorHandler);

app.use('/user',proxy(process.env.USER_SERVICE_URL));

app.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
});









