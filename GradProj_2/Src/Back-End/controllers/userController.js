// Manages user profiles and account actions
const userService = require("../services/userService");
const errorHandler = require("../middlewares/errorHandler");



const getSingleUser =  async (req, res) => {
    try {
      const { userId } = req.user.userId; // Extract userId from the token
      const result = await userService.getUserById(userId);
      return handleSuccess(res, result);
    } catch (error) {
      return handleError(res, "E0010", error.message);
    }
};

const updateSingleUser = async (req, res) =>  {
  try {
    const userData = req.body;
    const result = await userService.updateUser(userData);
    return handleSuccess(res, result);
  } catch (error) {
    return handleError(res, "E0010", error.message);
  }
};

module.exports = {
    getSingleUser,
    updateSingleUser
}