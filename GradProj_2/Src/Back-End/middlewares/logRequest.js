const logger = require("../utils/logger"); // Import your Winston logger

// Middleware function to log incoming requests and outgoing responses
const logRequest = (req, res, next) => {
  const startTime = new Date();

  // Log the request details
  logger.info(`Incoming Request: 
    Method: ${req.method}, 
    URL: ${req.originalUrl}, 
    Headers: ${JSON.stringify(req.headers)}, 
    Body: ${JSON.stringify(req.body)}`);

  // Capture and log the response
  const oldWrite = res.write;
  const oldEnd = res.end;
  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      // Ensure the chunk is a Buffer before pushing
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const responseBody = Buffer.concat(chunks).toString("utf8");
    const responseTime = new Date() - startTime;

    logger.info(`Outgoing Response: 
    Status: ${res.statusCode}, 
    Response Time: ${responseTime} ms, 
    Headers: ${JSON.stringify(res.getHeaders())}, 
    Body: ${responseBody}`);

    oldEnd.apply(res, arguments);
  };

  next();
};

module.exports = logRequest;
