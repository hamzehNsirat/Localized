// User schema (Admin, Retailer, Supplier roles)
const { executeQuery } = require("../config/database");
const userModel = {
  async create(inputData) {
    return await executeQuery(
      "SELECT user_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) AS RES",
      [
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
      ]
    );
  },
  async get(inputData) {
    return await executeQuery("SELECT * FROM user_get_by_id($1)", [
      inputData.userId
    ]);
  },
  async update(inputData) {
    return await executeQuery(
      "SELECT user_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) AS RES",
      [
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
        inputData.userPhoneNumber,
        inputData.lastModifiedBy,
        inputData.userImage,
        inputData.userId
      ]
    );
  },
  async delete(inputData) {
    return await executeQuery("SELECT user_delete($1) AS RES", [inputData.userId]);
  },
  async validate(inputData) {
    return await executeQuery("SELECT validate_user_login($1, $2, $3) AS RES", [
      inputData.userName,
      inputData.userEmail,
      inputData.userPassword
    ]);
  },
};
module.exports = userModel;
