const executeQuery = require("../config/database");

const TransactionStatus = {
  async getAllTransactionStatuses() {
    return await executeQuery("SELECT * FROM transaction_status_get_all()", []);
  },

  async getTransactionStatusById(statusId) {
    return await executeQuery(
      "SELECT * FROM transaction_status_get_by_id($1)",
      [statusId]
    );
  },

  async insertTransactionStatus(inputData) {
    return await executeQuery(
      "SELECT FROM transaction_status_insert($1, $2)",
      [inputData.statusDescription, inputData.lastModifiedBy]
    );
  },

  async updateTransactionStatus(statusId, inputData) {
    return await executeQuery(
      "SELECT FROM transaction_status_update($1, $2, $3)",
      [statusId, inputData.statusDescription, inputData.lastModifiedBy]
    );
  },

  async deleteTransactionStatus(statusId) {
    return await executeQuery("SELECT FROM transaction_status_delete($1)", [
      statusId,
    ]);
  },
};

module.exports = TransactionStatus;
