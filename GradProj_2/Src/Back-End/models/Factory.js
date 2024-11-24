// Factory Model
const { executeQuery } = require("../config/database");

const Factory = {
  async insertOwnedFactory(ownerId, factoryEstId) {
    return await executeQuery("SELECT factory_owned_insert($1, $2)", [
      ownerId,
      factoryEstId,
    ]);
  },

  async getOwnedFactories(ownerId) {
    return await executeQuery("SELECT * FROM factory_owned_get($1)", [ownerId]);
  },

  async getFactoryIndustry(factoryEstId) {
    return await executeQuery("SELECT * FROM factory_industry_get($1)", [
      factoryEstId,
    ]);
  },

  async getFactoryCategories(factoryEstId) {
    return await executeQuery("SELECT * FROM factory_categories_get($1)", [
      factoryEstId,
    ]);
  },
};

module.exports = Factory;