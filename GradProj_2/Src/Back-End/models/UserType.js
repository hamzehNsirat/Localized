// UserType schema
const { executeQuery } = require("../config/database");

const userTypeModel = {
  async create(inputData) {
    return await executeQuery(
      "SELECT user_type_insert($1, $2) AS RES",
      [
        inputData.userTypeDesc,
        inputData.lastModifiedBy
      ]
    );
  },
  async getById(inputData) {
    return await executeQuery("SELECT * FROM user_type_get_by_id($1)", [
      inputData.userType,
    ]);
  },
  async getAll() { 
    return await executeQuery("SELECT * FROM user_type_get_all()", []); 
  },
  async update(inputData) {
    return await executeQuery("SELECT user_type_update($1, $2, $3) AS RES", [
      inputData.userType,
      inputData.userTypeDesc,
      inputData.lastModifiedBy,
    ]);
  },
  async delete(inputData) {
    return await executeQuery("SELECT user_type_delete($1) AS RES", [
      inputData.userType
    ]);
  },
};
module.exports = userTypeModel;
