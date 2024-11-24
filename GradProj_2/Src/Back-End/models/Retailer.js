// Retailer Model
const { executeQuery } = require("../config/database");

const Retailer = {
  async getRetailerById(retailerId) {
    return await executeQuery("SELECT * FROM retailer_get_by_id($1)", [
      retailerId,
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
      "SELECT retailer_update($1, $2, $3, $4, $5, $6, $7, $8) AS update_res",
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
};

module.exports = Retailer;
