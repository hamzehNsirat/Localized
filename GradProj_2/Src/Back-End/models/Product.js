const { executeQuery } = require("../config/database");

const Product = {
  async getById(productId) {
    return await executeQuery("SELECT * FROM product_get_by_id($1)", [
      productId,
    ]);
  },

  async getBySupplier(supplierId, pageSize, pageIndex) {
    return await executeQuery(
      "SELECT * FROM product_get_by_supplier($1,$2,$3)",
      [supplierId, pageSize, pageIndex]
    );
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
  async getMarketplaceProducts(retailerId, pageSize, pageIndex) {
    try {
      const query = `
        SELECT * 
        FROM retailer_get_marketplace_products($1, $2, $3);
      `;

      const params = [retailerId, pageSize, pageIndex];
      const result = await executeQuery(query, params);

      return result;
    } catch (error) {
      console.error("Error fetching marketplace products:", error.message);
      throw error;
    }
  },
  async fetchProductsByIndustryAndCategory(
    industryTypes,
    categories,
    pageSize,
    pageIndex
  ) {
    try {
      const query = `
        SELECT * 
        FROM fetch_products_by_industry_and_category($1, $2, $3, $4);
      `;

      const params = [
        industryTypes || null, // Pass null if industryTypes is undefined
        categories || null, // Pass null if categories is undefined
        pageSize,
        pageIndex,
      ];

      const result = await executeQuery(query, params);

      return result;
    } catch (error) {
      console.error(
        "Error fetching products by industry and category:",
        error.message
      );
      throw error;
    }
  },
  async searchProducts(searchTerm, pageSize, pageIndex) {
    try {
      const query = `
        SELECT * 
        FROM search_products($1, $2, $3);
      `;
      const params = [searchTerm, pageSize, pageIndex];
      const result = await executeQuery(query, params);

      return result;
    } catch (error) {
      console.error("Error searching products:", error.message);
      throw error;
    }
  },
  async getSupplierDetails(supplierId, pageSize, pageIndex) {
    try {
      const result = await executeQuery(
        "SELECT * FROM get_supplier_details($1, $2, $3)",
        [supplierId, pageSize, pageIndex]
      );

      // Return the first row since the result contains aggregated data
      return result;
    } catch (error) {
      console.error("Error fetching supplier details:", error.message);
      return {
        success: false,
        error: "An error occurred while fetching supplier details.",
      };
    }
  },
  async getMarketplaceProductsSupplier(supplierId, pageSize, pageIndex) {
    try {
      const query = `
        SELECT * 
        FROM supplier_get_marketplace_products($1, $2, $3);
      `;

      const params = [supplierId, pageSize, pageIndex];
      const result = await executeQuery(query, params);
      return result;
    } catch (error) {
      console.error("Error fetching marketplace products:", error.message);
      throw error;
    }
  },
};

module.exports = Product;
