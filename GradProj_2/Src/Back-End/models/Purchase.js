const { executeQuery } = require("../config/database");

const Purchase = {
  // Get purchase by multiple identifiers
  async getByIds(purchaseId, supplierId, buyerId, quotationId) {
    return await executeQuery(
      "SELECT * FROM purchase_get_by_ids($1, $2, $3, $4)",
      [purchaseId, supplierId, buyerId, quotationId]
    );
  },

  async insertPurchase(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)",
      [
        inputData.quotationId,
        inputData.buyerId,
        inputData.supplierId,
        inputData.purchaseStatusId,
        inputData.paymentReference,
        inputData.reconciliationReference,
        inputData.externalPayReference,
        inputData.paymentAmount,
        inputData.paymentCurrency,
        inputData.paymentExchangeRate,
        inputData.lastModifiedBy,
        inputData.paymentMethod,
        inputData.creditCardHolder,
        inputData.creditCardNumber,
        inputData.creditCardExpiry,
        inputData.creditCVC,
        inputData.supplierIban,
        inputData.supplierBankAccountNum,
        inputData.supplierBankName,
      ]
    );
  },

  async updatePurchase(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)",
      [
        inputData.purchaseId,
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
        inputData.paymentMethod,
        inputData.creditCardHolder,
        inputData.creditCardNumber,
        inputData.creditCardExpiry,
        inputData.creditCVC,
        inputData.supplierIban,
        inputData.supplierBankAccountNum,
        inputData.supplierBankName,
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
