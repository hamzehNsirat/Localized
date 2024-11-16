const { executeQuery } = require("../config/database");
const IndustryModel = {
  async create(inputData) {
    return await executeQuery("SELECT industry_type_insert($1, $2) AS RES", [
      inputData.industryTypeDesc,
      inputData.lastModifiedBy
    ]);
  },
  async getById(inputData) {
    return await executeQuery("SELECT * FROM industry_type_get_by_id($1)", [
      inputData.industryType
    ]);
  },
  async getAll() {
    return await executeQuery("SELECT * FROM industry_type_get_all()", []);
  },
  async update(inputData) {
    return await executeQuery(
      "SELECT industry_type_update($1, $2, $3) AS RES",
      [
        inputData.industryType,
        inputData.industryTypeDesc,
        inputData.lastModifiedBy
      ]
    );
  },
  async delete(inputData) {
    return await executeQuery("SELECT industry_type_delete($1) AS RES", [
      inputData.industryType,
    ]);
  },
};
module.exports = IndustryModel;
