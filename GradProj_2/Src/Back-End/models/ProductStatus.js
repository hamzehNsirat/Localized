// Product Status Model
const executeQuery = require("../config/database"); // Database connection

const ProductStatus = {
  async getAllProductStatuses() {
    return await executeQuery("SELECT * FROM product_status_get_all()", []);
  },

  async getProductStatusById(productStatusId) {
    return await executeQuery("SELECT * FROM product_status_get_by_id($1)", [
      productStatusId,
    ]);
  },

  async insertProductStatus(inputData) {
    return await executeQuery("SELECT FROM product_status_insert($1, $2)", [
      inputData.productStatus,
      inputData.lastModifiedBy,
    ]);
  },

  async updateProductStatus(productStatusId, inputData) {
    return await executeQuery(
      "SELECT  FROM product_status_update($1, $2, $3)",
      [productStatusId, inputData.productStatus, inputData.lastModifiedBy]
    );
  },

  async deleteProductStatus(productStatusId) {
    return await executeQuery("SELECT  FROM product_status_delete($1)", [
      productStatusId,
    ]);
  },
};

module.exports = ProductStatus;
