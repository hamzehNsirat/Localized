const executeQuery = require("../config/database");

const QuotationStatus = {
  async getAllQuotationStatuses() {
    return await executeQuery("SELECT * FROM quotation_status_get_all()", []);
  },

  async getQuotationStatusById(statusId) {
    return await executeQuery("SELECT * FROM quotation_status_get_by_id($1)", [
      statusId,
    ]);
  },

  async insertQuotationStatus(inputData) {
    return await executeQuery("SELECT FROM quotation_status_insert($1, $2)", [
      inputData.statusDescription,
      inputData.lastModifiedBy,
    ]);
  },

  async updateQuotationStatus(statusId, inputData) {
    return await executeQuery(
      "SELECT FROM quotation_status_update($1, $2, $3)",
      [statusId, inputData.statusDescription, inputData.lastModifiedBy]
    );
  },

  async deleteQuotationStatus(statusId) {
    return await executeQuery("SELECT FROM quotation_status_delete($1)", [
      statusId,
    ]);
  },
};

module.exports = QuotationStatus;
