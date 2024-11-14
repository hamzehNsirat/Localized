// UserType schema
const { executeQuery } = require("../config/database");

const userStatusModel = {
  async create(inputData) {
    return await executeQuery("SELECT user_status_insert($1, $2) AS RES", [
      inputData.userStatusDesc,
      inputData.lastModifiedBy,
    ]);
  },
  async getById(inputData) {
    return await executeQuery("SELECT * FROM user_status_get_by_id($1)", [
      inputData.userStatus,
    ]);
  },
  async getAll() {
    return await executeQuery("SELECT * FROM user_status_get_all()", []);
  },
  async update(inputData) {
    return await executeQuery("SELECT user_status_update($1, $2, $3) AS RES", [
      inputData.userStatus,
      inputData.userStatusDesc,
      inputData.lastModifiedBy,
    ]);
  },
  async delete(inputData) {
    return await executeQuery("SELECT user_status_delete($1) AS RES", [
      inputData.userStatus
    ]);
  },
};
module.exports = userStatusModel;
