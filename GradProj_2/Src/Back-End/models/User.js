// User schema (Admin, Retailer, Supplier roles)
const { executeQuery } = require("../config/database");
const userModel = {
  async create(inputData) {
    return await executeQuery(
      "SELECT user_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) AS RES",
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
        inputData.isEmailVerified,
        inputData.userPhoneNumber,
        inputData.lastModifiedBy,
        inputData.userImage,
      ]
    );
  },
  async get(inputData) {
    return await executeQuery("SELECT * FROM user_get_by_id($1)", [
      inputData.userId,
    ]);
  },
  async update(inputData) {
    return await executeQuery(
      "SELECT * FROM user_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
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
        inputData.isEmailVerified,
        inputData.userPhoneNumber,
        inputData.lastModifiedBy,
        inputData.userImage,
        inputData.userId,
        inputData.isPassChange,
      ]
    );
  },
  async delete(inputData) {
    return await executeQuery("SELECT * FROM user_delete($1)", [
      inputData.userId,
    ]);
  },
  async validate(inputData) {
    return await executeQuery(
      "SELECT * FROM validate_user_login($1, $2, $3) AS RES",
      [inputData.userName, inputData.userEmail, inputData.userPassword]
    );
  },
  async getList(inputData) {
    return await executeQuery("SELECT * FROM user_get_list($1, $2)", [
      inputData.pageSize,
      inputData.pageIndex,
    ]);
  },
  async updateStatus(inputData) {
    return await executeQuery("SELECT * FROM user_update_status($1, $2, $3)", [
      inputData.userStatus,
      inputData.userId,
      inputData.lastModifiedBy,
    ]);
  },
  
};
module.exports = userModel;
