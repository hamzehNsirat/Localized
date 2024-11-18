const executeQuery = require("../config/database");

const Penalty = {
  async getAll() {
    return await executeQuery("SELECT * FROM penalty_get_all()", []);
  },

  async getById(penaltyId) {
    return await executeQuery("SELECT * FROM penalty_get_by_id($1)", [
      penaltyId,
    ]);
  },

  async getByEstablishment(establishmentId) {
    return await executeQuery(
      "SELECT * FROM penalty_get_by_establishment($1)",
      [establishmentId]
    );
  },

  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM penalty_insert($1, $2, $3, $4, $5, $6, $7)",
      [
        inputData.penaltyTypeId,
        inputData.establishmentId,
        inputData.penaltyInitiatorId,
        inputData.penaltyStatusId,
        inputData.penaltyNotes,
        inputData.creationDate,
        inputData.lastModifiedBy,
      ]
    );
  },

  async update(inputData) {
    return await executeQuery(
      "SELECT * FROM penalty_update($1, $2, $3, $4, $5, $6, $7)",
      [
        inputData.penaltyId,
        inputData.penaltyTypeId,
        inputData.establishmentId,
        inputData.penaltyInitiatorId,
        inputData.penaltyStatusId,
        inputData.penaltyNotes,
        inputData.lastModifiedBy,
      ]
    );
  },

  async delete(penaltyId, lastModifiedBy) {
    return await executeQuery("SELECT * FROM penalty_delete($1, $2)", [
      penaltyId,
      lastModifiedBy,
    ]);
  },
};

module.exports = Penalty;
