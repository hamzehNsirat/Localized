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

  async getSupplierByUser(userId) {
    const query = `
      SELECT * FROM supplier_get_by_user($1);
    `;
    const params = [userId];
    return await executeQuery(query, params);
  },

  async calculateSupplierEstablishmentCompletionPercentage(ownerId) {
    const query = `
      SELECT calculate_supplier_establishment_completion_percentage($1) AS completion_percentage;
    `;
    const params = [ownerId];
    const result = await executeQuery(query, params);
    return result[0]?.completion_percentage || 0;
  },
  async calculateCompletionPercentageSupplier(userId) {
    const query = `
      SELECT calculate_completion_percentage_supplier($1) AS completion_percentage;
    `;
    const params = [userId];
    const result = await executeQuery(query, params);
    return result[0]?.completion_percentage || 0;
  },
  async updateProfileViewsSupplier(supplierId) {
    const query = `
      SELECT supplier_update_profile_views($1);
    `;
    const params = [supplierId];
    const result = await executeQuery(query, params);
    return 0;
  },
};

module.exports = Supplier;
