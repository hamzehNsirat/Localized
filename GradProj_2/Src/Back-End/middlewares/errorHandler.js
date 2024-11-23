// Centralized error handler.
const errorCodes = require("../config/errorCodes"); // Load error codes and descriptions

const errorHandler = {
  /**
   * Handle success response
   * @param {Object} res - Express response object
   * @param {Object} payload - The payload to return in the response body
   * @param {Number} statusCode - HTTP status code (default 200)
   */
  handleSuccess(res, payload = {}, statusCode = 200) {
    return res.status(statusCode).json({
      header: {
        errorCode: "0000",
        errorDescription: "SUCCESS", // Always success for successful responses
        statusCode: statusCode,
        message: "Operation completed successfully",
      },
      body: payload,
    });
  },

  /**
   * Handle error response
   * @param {Object} res - Express response object
   * @param {String} errorKey - Key to identify error in errorCodes
   * @param {Object} [details] - Optional additional error details
   */
  handleError(res, errorKey, details = null) {
    const error = errorCodes[errorKey] || errorCodes.DEFAULT_ERROR;

    const response = {
      header: {
        errorCode: error.errorCode || "9999",
        errorDescription: error.errorDescription,
        statusCode: error.errorCode,
        message: error.message || "An error occurred",
      },
    };

    if (details) {
      response.body = { details };
    }

    return res.status(error.statusCode).json(response);
  },
};

module.exports = errorHandler;
