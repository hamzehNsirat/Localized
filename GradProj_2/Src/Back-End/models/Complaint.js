// Complaints model for managing retailer-supplier complaints
const { executeQuery } = require("../config/database");

const Complaint = {
  async getAll() {
    return await executeQuery("SELECT * FROM complaint_get_all()", []);
  },

  async getById(complaintId) {
    return await executeQuery("SELECT * FROM complaint_get_by_id($1)", [
      complaintId,
    ]);
  },

  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM complaint_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [
        inputData.complaintTypeId,
        inputData.reviewerId,
        inputData.supplierId,
        inputData.retailerId,
        inputData.complaintStatusId,
        inputData.complaintNotes,
        inputData.submitterType,
        inputData.lastModifiedBy,
        inputData.resolutionNotes,
        inputData.quotationId,
      ]
    );
  },

  async update(inputData) {
    return await executeQuery(
      "SELECT * FROM complaint_update($1, $2, $3, $4, $5)",
      [
        inputData.reviewerId,
        inputData.complaintStatusId,
        inputData.lastModifiedBy,
        inputData.resolutionNotes,
        inputData.complaintId,
      ]
    );
  },

  async delete(complaintId, lastModifiedBy) {
    return await executeQuery("SELECT * FROM complaint_delete($1, $2)", [
      complaintId,
      lastModifiedBy,
    ]);
  },
};

module.exports = Complaint;
