const executeQuery = require("../config/database");

const PurchaseStatus = {

  async getAll() {
    return await executeQuery("SELECT * FROM purchase_status_get_all()", []);
  },

  /**
   * Get a purchase status by ID
   * @param {number} purchaseStatusId - The ID of the purchase status
   * @returns {Promise} - Purchase status details
   */
  async getById(purchaseStatusId) {
    return await executeQuery("SELECT * FROM purchase_status_get_by_id($1)", [
      purchaseStatusId,
    ]);
  },

  /**
   * Insert a new purchase status
   * @param {Object} inputData - Data for the new purchase status
   * @param {string} inputData.purchaseStatus - The name of the purchase status
   * @param {number} inputData.lastModifiedBy - ID of the user modifying the record
   * @returns {Promise} - Newly created purchase status ID
   */
  async insert(inputData) {
    return await executeQuery("SELECT * FROM purchase_status_insert($1, $2)", [
      inputData.purchaseStatus,
      inputData.lastModifiedBy,
    ]);
  },

  /**
   * Update an existing purchase status
   * @param {Object} inputData - Data for updating the purchase status
   * @param {number} inputData.purchaseStatusId - The ID of the purchase status to update
   * @param {string} [inputData.purchaseStatus] - Updated name of the purchase status (optional)
   * @param {number} inputData.lastModifiedBy - ID of the user modifying the record
   * @returns {Promise} - Update result
   */
  async update(inputData) {
    return await executeQuery(
      "SELECT * FROM purchase_status_update($1, $2, $3)",
      [
        inputData.purchaseStatusId,
        inputData.purchaseStatus || null,
        inputData.lastModifiedBy,
      ]
    );
  },

  /**
   * Delete a purchase status by ID
   * @param {number} purchaseStatusId - The ID of the purchase status to delete
   * @returns {Promise} - Delete result
   */
  async delete(purchaseStatusId) {
    return await executeQuery("SELECT * FROM purchase_status_delete($1)", [
      purchaseStatusId,
    ]);
  },
};

module.exports = PurchaseStatus;
