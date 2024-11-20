const { executeQuery } = require("../config/database");

const ComplaintType = {
  async getAllComplaintTypes() {
    return await executeQuery("SELECT * FROM complaint_type_get_all()", []);
  },

  async getComplaintTypeById(typeId) {
    return await executeQuery("SELECT * FROM complaint_type_get_by_id($1)", [
      typeId,
    ]);
  },

  async insertComplaintType(inputData) {
    return await executeQuery("SELECT FROM complaint_type_insert($1, $2)", [
      inputData.typeDescription,
      inputData.lastModifiedBy,
    ]);
  },

  async updateComplaintType(typeId, inputData) {
    return await executeQuery(
      "SELECT  FROM complaint_type_update($1, $2, $3)",
      [typeId, inputData.typeDescription, inputData.lastModifiedBy]
    );
  },

  async deleteComplaintType(typeId) {
    return await executeQuery("SELECT FROM complaint_type_delete($1)", [
      typeId,
    ]);
  },
};

module.exports = ComplaintType;
