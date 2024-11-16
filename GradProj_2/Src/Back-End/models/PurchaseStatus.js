const executeQuery = require("../config/database");

const PurchaseStatus = {
  async getAllPurchaseStatuses() {
    return await executeQuery("SELECT * FROM purchase_status_get_all()", []);
  },

  async getPurchaseStatusById(statusId) {
    return await executeQuery("SELECT * FROM purchase_status_get_by_id($1)", [
      statusId,
    ]);
  },

  async insertPurchaseStatus(inputData) {
    return await executeQuery("SELECT FROM purchase_status_insert($1, $2)", [
      inputData.statusDescription,
      inputData.lastModifiedBy,
    ]);
  },

  async updatePurchaseStatus(statusId, inputData) {
    return await executeQuery(
      "SELECT FROM purchase_status_update($1, $2, $3)",
      [statusId, inputData.statusDescription, inputData.lastModifiedBy]
    );
  },

  async deletePurchaseStatus(statusId) {
    return await executeQuery("SELECT FROM purchase_status_delete($1)", [
      statusId,
    ]);
  },
};

module.exports = PurchaseStatus;
