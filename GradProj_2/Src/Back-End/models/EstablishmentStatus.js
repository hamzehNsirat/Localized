const { executeQuery } = require("../config/database");

const establishmentStatusModel = {
  async getAllEstablishmentStatuses() {
    return await executeQuery("", [
      "SELECT * FROM establishment_status_get_all()",
      [],
    ]);
  },

  async getEstablishmentStatusById(statusId) {
    return await executeQuery("", [
      "SELECT * FROM establishment_status_get_by_id($1)",
      [statusId],
    ]);
  },

  async insertEstablishmentStatus(inputData) {
    return await executeQuery("", [
      "SELECT establishment_status_insert($1, $2) AS RES",
      [inputData.establishmentStatusDesc, inputData.lastModifiedBy],
    ]);
  },

  async updateEstablishmentStatus(statusId, inputData) {
    return await executeQuery("", [
      "SELECT establishment_status_update($1, $2, $3) AS RES",
      [statusId, inputData.establishmentStatusDesc, inputData.lastModifiedBy],
    ]);
  },

  async deleteEstablishmentStatus(statusId) {
    return await executeQuery("", [
      "SELECT establishment_status_delete($1) AS RES",
      [statusId],
    ]);
  },
};

module.exports = establishmentStatusModel;
