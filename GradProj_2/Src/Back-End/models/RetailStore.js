const executeQuery = require("../config/database"); // Database connection

const RetailStore = {
  async insertRetailStore(ownerId, retailstoreEstId, lastModifiedBy) {
    return await executeQuery(
      "SELECT retailstore_owned_insert($1, $2) AS execution_result",
      [ownerId, retailstoreEstId]
    );
  },

  async getOwnedRetailStores(ownerId) {
    return await executeQuery("SELECT * FROM retailstore_owned_get($1)", [
      ownerId,
    ]);
  },

  async getRetailStoreIndustryType(retailstoreEstId) {
    return await executeQuery("SELECT * FROM retailstore_industry_get($1)", [
      retailstoreEstId,
    ]);
  },

  async getRetailStoreIndustryTypeCategories(retailstoreEstId) {
    return await executeQuery("SELECT * FROM retailstore_categories_get($1)", [
      retailstoreEstId,
    ]);
  },
};

module.exports = RetailStore;
