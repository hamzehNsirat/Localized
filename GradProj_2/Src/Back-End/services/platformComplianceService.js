// Contains platform-compliance-related logic.
const Supplier = require("../models/Supplier");
const Review = require("../models/Review");

const { sendEmail } = require("../config/email");
const env = require("../config/env");
const {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");
const platformComplianceService = {
  async submitReview(inputData) {
    await beginTransaction();
    const reviewDetails = {
      supplierId: inputData.supplierId,
      retailerId: inputData.retailerId,
      rating: inputData.rating,
      reviewComment: inputData.reviewComment,
      reviewDate: null,
      lastModificationDate: null,
      lastModifiedBy: 1,
    };
    const reviewInsertDb = await Review.insert(reviewDetails);
    if (
      !reviewInsertDb[0].out_review_id ||
      reviewInsertDb[0].out_review_id == "-1"
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Submit Review",
      };
    }
    try {
        await Supplier.updateOverallRatingBySupplier(inputData.supplierId);
    } catch {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Calculate Supplier Overall Rating",
      };
    }
    await commitTransaction();
    return {
      success: true,
    };
  },
};
module.exports = platformComplianceService;