// User schema (Admin, Retailer, Supplier roles)
const { executeQuery } = require("../config/database");
const userModel = {
  async create(inputData) {
    return await executeQuery("", [
      inputData.nationalNumber,
      inputData.userType,
      inputData.userStatus,
      inputData.firstName,
      inputData.middleName,
      inputData.lastName,
      inputData.dateOfBirth,
      inputData.userName,
      inputData.userAddress,
      inputData.userEmail,
      inputData.userPassword,
      inputData.userPassSalt,
      inputData.isEmailVerified,
      inputData.userPhoneNumber,
      inputData.lastModifiedBy,
      inputData.userImage
    ]);
  },
  async update(inputData) {
    return await executeQuery("SELECT * FROM user_get_by_id($1)", [user_id]);
  },
  async get(inputData) {
    return await executeQuery("", []);
  },
  async delete(inputData) {
    return await executeQuery("", []);
  },
  async validate(inputData) {
    return await executeQuery("", []);
  }
};
