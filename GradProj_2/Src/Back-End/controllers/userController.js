// Manages user profiles and account actions
const userService = require("../services/userService");
const errorHandler = require("../middlewares/errorHandler");



const getSingleUser =  async (req, res) => {
    try {
      const { userId } = req.user; // Extract userId from the token
      const result = await userService.getUserById(userId);
      return handleSuccess(res, result);
    } catch (error) {
      return handleError(res, "USER_GET_ERROR", error.message);
    }
};

const updateSingleUser = async (req, res) =>  {
  try {
    const userData = req.body;
    const result = await userService.updateUser(userData);
    return handleSuccess(res, result);
  } catch (error) {
    return handleError(res, "USER_UPDATE_ERROR", error.message);
  }
};

module.exports = {
    getSingleUser,
    updateSingleUser
}