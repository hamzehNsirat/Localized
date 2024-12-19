const { executeQuery } = require("../config/database");

const PenaltyModel = {
  // Get all penalties with pagination
  async getAllPenalties(pageSize, pageIndex) {
    const query = `
            SELECT * FROM penalty_get_all($1, $2)
        `;
    try {
      return await executeQuery(query, [pageSize, pageIndex]);
    } catch (error) {
      console.error("Error in getAllPenalties:", error);
      throw error;
    }
  },

  // Search all penalties with pagination
  async searchPenalties(searchTerm, pageSize, pageIndex) {
    const query = `
            SELECT * FROM penalty_search($1, $2, $3)
        `;
    try {
      const result = await executeQuery(query, [
        searchTerm,
        pageSize,
        pageIndex,
      ]);
      return result; 
    } catch (error) {
      console.error("Error in searchPenalties:", error);
      throw error;
    }
  },
  // Get penalty by ID
  async getPenaltyById(penaltyId) {
    const query = `
            SELECT * FROM penalty_get_by_id($1)
        `;
    try {
      return await executeQuery(query, [penaltyId]);
    } catch (error) {
      console.error("Error in getPenaltyById:", error);
      throw error;
    }
  },

  // Insert a new penalty
  async insertPenalty(inputData) {
    const query = `
            SELECT * FROM penalty_insert($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        `;
    try {
      const result = await executeQuery(query, [
        inputData.penaltyTypeId,
        inputData.establishmentId,
        inputData.penaltyInitiatorId,
        inputData.penaltyStatusId,
        inputData.penaltyNotes,
        inputData.lastModifiedBy,
        inputData.penaltyTitle,
        inputData.penaltyWeight,
        inputData.relatedComplaintId,
      ]);
      return result;
    } catch (error) {
      console.error("Error in insertPenalty:", error);
      throw error;
    }
  },

  // Delete a penalty
  async deletePenalty(penaltyId) {
    const query = `
            SELECT penalty_delete($1) AS result
        `;
    try {
      const result = await executeQuery(query, [penaltyId]);
      return result;
    } catch (error) {
      console.error("Error in deletePenalty:", error);
      throw error;
    }
  },

  // Update penalty status
  async updatePenaltyStatus(penaltyId, penaltyStatus, lastModifiedBy) {
    const query = `
            SELECT penalty_update_status($1, $2, $3) AS result
        `;
    try {
      const result = await executeQuery(query, [
        penaltyId,
        penaltyStatus,
        lastModifiedBy,
      ]);
      return result;
    } catch (error) {
      console.error("Error in updatePenaltyStatus:", error);
      throw error;
    }
  },
};

module.exports = PenaltyModel;
