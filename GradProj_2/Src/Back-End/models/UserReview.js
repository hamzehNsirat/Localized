const executeQuery = require("../config/database");

const UserReview = {
  async getAll() {
    return await executeQuery("SELECT * FROM user_review_get_all()", []);
  },

  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM user_review_insert($1, $2, $3, $4, $5, $6)",
      [
        inputData.adminId,
        inputData.userId,
        inputData.decisionTaken,
        inputData.decisionReason,
        inputData.creationDate,
        inputData.lastModifiedBy,
      ]
    );
  },

  async update(inputData) {
    return await executeQuery(
      "SELECT * FROM user_review_update($1, $2, $3, $4)",
      [
        inputData.reviewerId,
        inputData.decisionTaken,
        inputData.decisionReason,
        inputData.userReviewId,
      ]
    );
  },
};

module.exports = UserReview;
