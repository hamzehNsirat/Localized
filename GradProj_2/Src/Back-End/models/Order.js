// Order schema, including status and product relationship
const { executeQuery } = require("../config/database");

const Order = {
  // Get order by ID
  async getById(orderId) {
    return await executeQuery("SELECT * FROM order_get_by_Id($1)", [orderId]);
  },

  async getByQuotation(quotationId) {
    return await executeQuery("SELECT * FROM order_get_by_quotation($1)", [
      quotationId,
    ]);
  },

  async insertOrder(inputData) {
    return await executeQuery(
      "SELECT * FROM order_insert($1, $2, $3, $4, $5)",
      [
        inputData.quotationId,
        inputData.productId,
        inputData.orderQuantity,
        inputData.orderPrice,
        inputData.lastModifiedBy,
      ]
    );
  },
};

module.exports = Order;
