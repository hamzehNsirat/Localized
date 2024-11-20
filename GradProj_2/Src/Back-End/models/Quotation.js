// Quotation schema, linking retailers and suppliers
const { executeQuery } = require("../config/database");

const Quotation = {
  async getAllData(quotationId) {
    return await executeQuery("SELECT * FROM quotation_get_all_data($1)", [
      quotationId,
    ]);
  },

  async getBySupplier(supplierId) {
    return await executeQuery("SELECT * FROM quotation_get_by_supplier($1)", [
      supplierId,
    ]);
  },

  async getByRetailer(retailerId) {
    return await executeQuery("SELECT * FROM quotation_get_by_retailer($1)", [
      retailerId,
    ]);
  },

  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM quotation_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)",
      [
        inputData.requesterId,
        inputData.supplierId,
        inputData.quotationStatusId,
        inputData.quotationRequestDate,
        inputData.quotationDetails,
        inputData.quotationAttachments,
        inputData.paymentDetailsBank,
        inputData.paymentDetailsIBAN,
        inputData.paymentDetailsBankAccNum,
        inputData.fromEstablishmentName,
        inputData.toEstablishmentName,
        inputData.shipToAddress,
        inputData.billToAddress,
        inputData.supplierAddress,
        inputData.lastModifiedBy,
      ]
    );
  },

  async updateDetails(inputData) {
    return await executeQuery(
      "SELECT * FROM quotation_update_details($1, $2, $3)",
      [
        inputData.quotationId,
        inputData.quotationDetails,
        inputData.quotationAttachments,
      ]
    );
  },

  async updateStatus(inputData) {
    return await executeQuery("SELECT * FROM quotation_update_status($1, $2)", [
      inputData.quotationId,
      inputData.quotationStatusId,
    ]);
  },
};

module.exports = Quotation;
