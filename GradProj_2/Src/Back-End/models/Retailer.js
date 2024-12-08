// Retailer Model
const { executeQuery } = require("../config/database");

const Retailer = {
  async getRetailerById(retailerId) {
    return await executeQuery("SELECT * FROM retailer_get_by_id($1)", [
      retailerId,
    ]);
  },
  async getRetailerByUserId(retailerUserId) {
    return await executeQuery("SELECT * FROM retailer_get_by_user($1)", [
      retailerUserId,
    ]);
  },
  async getRetailerComplianceStatistics(retailerId) {
    return await executeQuery(
      "SELECT * FROM get_retailer_compliance_statistics($1)",
      [retailerId]
    );
  },

  async insertRetailer(inputData) {
    return await executeQuery(
      "SELECT * FROM retailer_insert($1, $2, $3, $4, $5, $6, $7) AS retailer_id",
      [
        inputData.retailerUserId,
        inputData.retailerTaxIdentificationNum,
        inputData.retailerBankAccountNum,
        inputData.retailerIban,
        inputData.retailerComplianceIndicator,
        inputData.retailerComplaintCount,
        inputData.lastModifiedBy,
      ]
    );
  },

  async updateRetailer(retailerId, inputData) {
    return await executeQuery(
      "SELECT * FROM retailer_update($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        retailerId,
        inputData.retailerUserId,
        inputData.retailerTaxIdentificationNum,
        inputData.retailerBankAccountNum,
        inputData.retailerIban,
        inputData.retailerComplianceIndicator,
        inputData.retailerComplaintCount,
        inputData.lastModifiedBy,
      ]
    );
  },

  async deleteRetailer(retailerUserId) {
    return await executeQuery("SELECT retailer_delete($1) AS update_res", [
      retailerUserId,
    ]);
  },

  /**
   * Calculate the retailer's overall completion percentage.
   * This combines retailer-specific and user-specific data for a given user ID.
   *
   * @param {number} userId - The ID of the user associated with the retailer.
   * @returns {Promise<number>} - The completion percentage as a float.
   */
  async calculateCompletionPercentage(userId) {
    return await executeQuery(
      "SELECT calculate_completion_percentage_retailer($1) AS completion_percentage",
      [userId]
    );
  },

  /**
   * Calculate the establishment's completion percentage for a retailer.
   *
   * @param {number} ownerId - The ID of the owner associated with the establishment.
   * @returns {Promise<number>} - The establishment's completion percentage as a float.
   */
  async calculateEstablishmentCompletionPercentage(ownerId) {
    return await executeQuery(
      "SELECT calculate_retailer_establishment_completion_percentage($1) AS establishment_completion_percentage",
      [ownerId]
    );
  },
};

module.exports = Retailer;
