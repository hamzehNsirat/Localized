// Product schema with attributes (name, price, description, etc.)
const executeQuery = require("../config/database"); // Database connection

const Product = {
  async getProductById(productId) {
    return await executeQuery("SELECT * FROM product_get_by_id($1)", [
      productId,
    ]);
  },

  async getProductsBySupplier(supplierId) {
    return await executeQuery("SELECT * FROM product_get_by_supplier($1)", [
      supplierId,
    ]);
  },

  async insertProduct(inputData) {
    return await executeQuery(
      "SELECT product_insert($1, $2, $3, $4, $5, $6, $7, $8, $9) AS out_product_id",
      [
        inputData.supplierId,
        inputData.productStatusId,
        inputData.productUnitPrice,
        inputData.productUnitPriceDiscount,
        inputData.productCategory,
        inputData.productDescription,
        inputData.productImage,
        inputData.productName,
        inputData.lastModifiedBy,
      ]
    );
  },

  async updateProduct(productId, inputData) {
    return await executeQuery(
      "SELECT product_update($1, $2, $3, $4, $5, $6, $7, $8, $9) AS update_res",
      [
        productId,
        inputData.productStatusId,
        inputData.productUnitPrice,
        inputData.productUnitPriceDiscount,
        inputData.productCategory,
        inputData.productDescription,
        inputData.productImage,
        inputData.productName,
        inputData.lastModifiedBy,
      ]
    );
  },

  async deleteProduct(productId) {
    return await executeQuery("SELECT product_delete($1) AS update_res", [
      productId,
    ]);
  },
};

module.exports = Product;
