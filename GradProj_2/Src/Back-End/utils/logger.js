const winston = require("winston");
const path = require("path");

// Define log file paths
const logDirectory = path.join(__dirname, "../logs");
const errorLogPath = path.join(logDirectory, "error.log");
const combinedLogPath = path.join(logDirectory, "combined.log");

// Create Winston logger
const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Write error logs to 'error.log'
    new winston.transports.File({ filename: errorLogPath, level: "error" }),

    // Write all logs to 'combined.log'
    //new winston.transports.File({ filename: combinedLogPath }),
  ],
});

// Add console transport for development environment
logger.add(
new winston.transports.Console({
    format: winston.format.combine(
    winston.format.colorize(), // Colorize output
    winston.format.simple()
    ),
})
);

const DailyRotateFile = require("winston-daily-rotate-file");

logger.add(
  new DailyRotateFile({
    filename: "logs/%DATE%-combined.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d", // Keep logs for 14 days
  })
);


module.exports = logger;
