// Model for retailer-supplier reviews
const { executeQuery } = require("../config/database");

const Review = {
  // Fetch reviews by supplier ID
  async getBySupplier(supplierId) {
    return await executeQuery("SELECT * FROM review_get_by_supplier($1)", [
      supplierId,
    ]);
  },

  // Fetch reviews by retailer ID
  async getByRetailer(retailerId) {
    return await executeQuery("SELECT * FROM review_get_by_retailer($1)", [
      retailerId,
    ]);
  },

  // Fetch review by review ID
  async getById(reviewId) {
    return await executeQuery("SELECT * FROM review_get_by_id($1)", [reviewId]);
  },

  // Insert a new review
  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM review_insert($1, $2, $3, $4, $5, $6, $7)",
      [
        inputData.supplierId,
        inputData.retailerId,
        inputData.rating,
        inputData.reviewComment || null, // Optional
        inputData.reviewDate || null, // Optional
        inputData.lastModificationDate || null, // Optional
        inputData.lastModifiedBy,
      ]
    );
  },
};

module.exports = Review;
