const { executeQuery } = require("../config/database");

const Purchase = {
  // Get purchase by multiple identifiers
  async getByIds(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_get_by_ids($1, $2, $3, $4)",
      [
        inputData.purchaseId || null,
        inputData.supplierId || null,
        inputData.buyerId || null,
        inputData.quotationId || null,
      ]
    );
  },

  // Insert a new purchase
  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      [
        inputData.quotationId,
        inputData.buyerId,
        inputData.supplierId,
        inputData.purchaseStatusId,
        inputData.purchaseDate,
        inputData.paymentReference,
        inputData.reconciliationReference,
        inputData.externalPayReference,
        inputData.paymentAmount,
        inputData.paymentCurrency,
        inputData.paymentExchangeRate,
        inputData.lastModificationDate,
        inputData.lastModifiedBy,
      ]
    );
  },

  // Update an existing purchase
  async update(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
      [
        inputData.purchaseId,
        inputData.quotationId || null,
        inputData.buyerId || null,
        inputData.supplierId || null,
        inputData.purchaseStatusId || null,
        inputData.purchaseDate || null,
        inputData.paymentReference || null,
        inputData.reconciliationReference || null,
        inputData.externalPayReference || null,
        inputData.paymentAmount || null,
        inputData.paymentCurrency || null,
        inputData.paymentExchangeRate || null,
        inputData.lastModificationDate || null,
        inputData.lastModifiedBy,
      ]
    );
  },

  // Delete a purchase (soft delete by marking status as expired)
  async delete(inputData) {
    return await executeQuery("SELECT * FROM purchase_delete($1)", [
      inputData.purchaseId,
    ]);
  },
};

module.exports = Purchase;
