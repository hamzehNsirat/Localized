const executeQuery = require("../config/database");

const PenaltyType = {
  async getAllPenaltyTypes() {
    return await executeQuery("SELECT * FROM penalty_type_get_all()", []);
  },

  async getPenaltyTypeById(typeId) {
    return await executeQuery("SELECT * FROM penalty_type_get_by_id($1)", [
      typeId,
    ]);
  },

  async insertPenaltyType(inputData) {
    return await executeQuery("SELECT FROM penalty_type_insert($1, $2)", [
      inputData.typeDescription,
      inputData.lastModifiedBy,
    ]);
  },

  async updatePenaltyType(typeId, inputData) {
    return await executeQuery("SELECT FROM penalty_type_update($1, $2, $3)", [
      typeId,
      inputData.typeDescription,
      inputData.lastModifiedBy,
    ]);
  },

  async deletePenaltyType(typeId) {
    return await executeQuery("SELECT FROM penalty_type_delete($1)", [
      typeId,
    ]);
  },
};

module.exports = PenaltyType;
