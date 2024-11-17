const executeQuery = require("../config/database");

const Category = {
  async getByIndustry(industryType) {
    return await executeQuery("SELECT * FROM category_get_by_industry($1)", [
      industryType,
    ]);
  },

  async getById(categoryId) {
    return await executeQuery("SELECT * FROM category_get_by_id($1)", [
      categoryId,
    ]);
  },

  async insert(inputData) {
    return await executeQuery("SELECT * FROM category_insert($1, $2, $3)", [
      inputData.industryType,
      inputData.categoryName,
      inputData.lastModifiedBy,
    ]);
  },
};

module.exports = Category;
