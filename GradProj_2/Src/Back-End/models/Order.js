// Order schema, including status and product relationship
const { executeQuery } = require("../config/database");

const Order = {
  // Get order by ID
  async getById(inputData) {
    return await executeQuery("SELECT * FROM order_get_by_Id($1)", [
      inputData.orderId,
    ]);
  },

  // Get orders by Quotation ID
  async getByQuotation(inputData) {
    return await executeQuery("SELECT * FROM order_get_by_quotation($1)", [
      inputData.quotationId,
    ]);
  },

  // Insert a new order
  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM order_insert($1, $2, $3, $4, $5, $6)",
      [
        inputData.quotationId,
        inputData.productId,
        inputData.orderQuantity,
        inputData.orderQuantityUnit,
        inputData.orderDate,
        inputData.lastModifiedBy,
      ]
    );
  },

  // Update an existing order
  async update(inputData) {
    return await executeQuery(
      "SELECT * FROM order_update($1, $2, $3, $4, $5, $6, $7)",
      [
        inputData.orderId,
        inputData.quotationId || null,
        inputData.productId || null,
        inputData.orderQuantity || null,
        inputData.orderQuantityUnit || null,
        inputData.orderDate || null,
        inputData.lastModifiedBy,
      ]
    );
  },

  // Delete an order
  async delete(inputData) {
    return await executeQuery("SELECT * FROM order_delete($1)", [
      inputData.orderId,
    ]);
  },
};

module.exports = Order;
