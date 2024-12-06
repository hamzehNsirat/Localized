const { executeQuery } = require("../config/database"); 
 
const Supplier = {
  async getSupplierById(supplierId) {
    return await executeQuery("SELECT * FROM supplier_get_by_id($1)", [
      supplierId,
    ]);
  },

  async getSupplierComplianceStatistics(supplierId) {
    return await executeQuery(
      "SELECT * FROM get_supplier_compliance_statistics($1)",
      [supplierId]
    );
  },

  async insertSupplier(inputData) {
    return await executeQuery(
      "SELECT * FROM supplier_insert($1, $2, $3, $4, $5, $6, $7, $8) AS out_supplier_id",
      [
        inputData.supplierUserId,
        inputData.supplierTaxIdentificationNum,
        inputData.supplierBankAccountNum,
        inputData.supplierIban,
        inputData.supplierComplianceIndicator,
        inputData.supplierComplaintCount,
        inputData.supplierPositiveReviewCount,
        inputData.lastModifiedBy,
      ]
    );
  },

  async updateSupplier(supplierId, inputData) {
    return await executeQuery(
      "SELECT supplier_update($1, $2, $3, $4, $5, $6, $7, $8, $9) AS update_res",
      [
        supplierId,
        inputData.supplierUserId,
        inputData.supplierTaxIdentificationNum,
        inputData.supplierBankAccountNum,
        inputData.supplierIban,
        inputData.supplierComplianceIndicator,
        inputData.supplierComplaintCount,
        inputData.supplierPositiveReviewCount,
        inputData.lastModifiedBy,
      ]
    );
  },

  async deleteSupplier(supplierUserId) {
    return await executeQuery("SELECT supplier_delete($1) AS update_res", [
      supplierUserId,
    ]);
  },
  async updateOverallRatingBySupplier(supplierId) {
    const query = `
      SELECT update_supplier_overall_rating($1);
    `;
    return await executeQuery(query, [supplierId]);
  },
};

module.exports = Supplier;
