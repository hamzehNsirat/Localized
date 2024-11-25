const authService = require("../services/authService");
const errorHandler = require("../middlewares/errorHandler");
const { executeQuery } = require("../config/database");
// Manages user authentication (login, signup, password reset)
const signUp = async (req, res) => {
  try {
    const { user, establishment } = req.body;

    if (!user || !user.userType) {
      return errorHandler.handleError(res, "E0005");
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
  try {
    const { user } = req.body;

    if (!user.userName || !user.userPassword) {
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

const signOut = async (req, res, next) => {
  try {
    const userId  = req.user.userId; // Extract user information from the decoded token (middleware-provided)
    // Invalidate the token by incrementing the user's token version in the database
    await executeQuery(
      "UPDATE user_localized SET token_version = token_version + 1 WHERE user_id = $1",
      [parseInt(userId)]
    );
    console.log("singOUTTTTTT");

    // Respond with a success message
    return errorHandler.handleSuccess(
      res,
      { success: true, message: "User successfully logged out" },
      200
    );
  } catch (error) {
    // Handle any errors
    return errorHandler.handleError(res,'E0009');
  }
};
module.exports = {
  signUp,
  signIn,
  signOut,
};
