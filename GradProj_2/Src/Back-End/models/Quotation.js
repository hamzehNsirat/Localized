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

  async getByRetailer(requesterId) {
    return await executeQuery("SELECT * FROM quotation_get_by_retailer($1)", [
      requesterId,
    ]);
  },

  async getQuotationActorsRetailer(Id) {
    const query = `
      SELECT quotation_id, supplier_id, requester_id
      FROM quotation WHERE requester_id = $1;
    `;
    const params = [Id];
    const result = await executeQuery(query, params);
    return result;
  },

  async getQuotationActorsSupplier(Id) {
    const query = `
      SELECT quotation_id, supplier_id, requester_id
      FROM quotation WHERE supplier_id = $1
    `;
    const params = [Id];
    const result = await executeQuery(query, params);
    return result;
  },

  async insertQuotation(inputData) {
    return await executeQuery(
      "SELECT * FROM quotation_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
      [
        inputData.requesterId,
        inputData.supplierId,
        inputData.quotationStatusId,
        inputData.quotationDetails,
        inputData.quotationAttachments,
        inputData.fromEstablishmentName,
        inputData.toEstablishmentName,
        inputData.shipToAddress,
        inputData.billToAddress,
        inputData.supplierAddress,
        inputData.lastModifiedBy,
        inputData.shippingCost,
        inputData.subTotal,
        inputData.total,
      ]
    );
  },

  async updateQuotationDetails(inputData) {
    return await executeQuery(
      "SELECT * FROM quotation_update_details($1, $2, $3, $4, $5, $6) AS update_res",
      [
        inputData.quotationId,
        inputData.quotationDetails,
        inputData.quotationAttachments,
        inputData.shippingCost,
        inputData.subTotal,
        inputData.total,
      ]
    );
  },

  async updateStatus(inputData) {
    return await executeQuery("SELECT * FROM quotation_update_status($1, $2)", [
      inputData.quotationId,
      inputData.quotationStatusId,
    ]);
  },
  async getQuotationsByRetailer(retailerId, pageSize, pageIndex) {
    const query = `
      SELECT * 
      FROM get_quotations_by_retailer($1, $2, $3)
    `;
    const params = [retailerId, pageSize, pageIndex];
    return await executeQuery(query, params);
  },
};

module.exports = Quotation;
