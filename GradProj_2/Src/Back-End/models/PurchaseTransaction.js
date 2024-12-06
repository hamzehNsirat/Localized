const { executeQuery } = require("../config/database");

const PurchaseTransaction = {
  // Get purchase transactions by Purchase ID
  async getByPurchase(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_transaction_get_by_purchase($1)",
      [inputData.purchaseId]
    );
  },

  // Insert a new purchase transaction
  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_transaction_insert($1, $2, $3, $4, $5)",
      [
        inputData.purchaseId,
        inputData.transactionStatusId,
        inputData.transactionDetails,
        inputData.lastModifiedDate,
        inputData.lastModifiedBy,
      ]
    );
  },

  // Update a purchase transaction's status
  async updateStatus(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_transaction_status_update($1, $2, $3)",
      [
        inputData.purchaseTransactionId,
        inputData.transactionStatusId,
        inputData.lastModifiedBy,
      ]
    );
  },
};

module.exports = PurchaseTransaction;
