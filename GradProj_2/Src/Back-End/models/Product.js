const { executeQuery } = require("../config/database");

const Product = {
  async getById(productId) {
    return await executeQuery("SELECT * FROM product_get_by_id($1)", [
      productId,
    ]);
  },

  async getBySupplier(supplierId) {
    return await executeQuery("SELECT * FROM product_get_by_supplier($1)", [
      supplierId,
    ]);
  },

  async insert(inputData) {
    return await executeQuery(
      `SELECT * FROM product_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        inputData.supplierId,
        inputData.productStatusId,
        inputData.productUnitPrice,
        inputData.productWholeSalePrice,
        inputData.productRetailPrice,
        inputData.productUnitPriceDiscount,
        inputData.productCategory,
        inputData.productDescription,
        inputData.productImage,
        inputData.productName,
        inputData.lastModifiedBy,
      ]
    );
  },

  async update(inputData) {
    return await executeQuery(
      `SELECT * FROM product_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        inputData.productId,
        inputData.productStatusId,
        inputData.productUnitPrice,
        inputData.productWholeSalePrice,
        inputData.productRetailPrice,
        inputData.productUnitPriceDiscount,
        inputData.productCategory,
        inputData.productDescription,
        inputData.productImage,
        inputData.productName,
        inputData.lastModifiedBy,
      ]
    );
  },
};

module.exports = Product;
