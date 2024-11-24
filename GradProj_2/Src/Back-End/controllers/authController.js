const jwt = require("jsonwebtoken");
const authService = require("../services/authService"); 
const errorHandler = require("../middlewares/errorHandler");

const keys = require("../config/keys");
const logger = require("../utils/logger");
// Manages user authentication (login, signup, password reset)
const signUp = async(req, res) => {
    debugger;
    try {
      const { user, establishment } = req.body;

      if (!user || !user.userType) {

        return errorHandler.handleError(res,"E0005");

      }

      const result = await authService.registerUser(user, establishment);

      if (!result.success) {
        return errorHandler.handleError(res, "E0006");
      }
      return errorHandler.handleSuccess(res, result, 201);
    } catch (error) {
      console.error("Sign-up error:", error);
      return errorHandler.handleError(res, "9999");
    }
};
const signIn = async (req, res) => {
  debugger;
  try {
    const { user } = req.body;

    if (!user.userName || !user.userPassword ) {
      return errorHandler.handleError(res, "E0007");
    }

    const result = await authService.loginUser(user);

    if (!result.success) {
      return errorHandler.handleError(res, "E0008");
    }
    return errorHandler.handleSuccess(res, result, 200);
  } catch (error) {
    console.error("Sign-in error:", error);
    return errorHandler.handleError(res, "9999");
  }
};

module.exports = {
  signUp,
  signIn 
};