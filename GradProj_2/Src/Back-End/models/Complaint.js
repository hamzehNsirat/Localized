const { executeQuery } = require("../config/database");

const Complaint = {
  /**
   * Get all complaints with pagination.
   * @param {number} pageSize - Number of records per page.
   * @param {number} pageIndex - Page index for pagination.
   * @returns {Promise<Array>} List of complaints.
   */
  async getAllComplaints(pageSize, pageIndex) {
    const query = `
      SELECT *
      FROM complaint_get_all($1, $2)
    `;
    const params = [pageSize, pageIndex];
    return await executeQuery(query, params);
  },

  /**
   * Get a complaint by its ID.
   * @param {number} complaintId - Complaint ID.
   * @returns {Promise<Object>} Complaint details.
   */
  async getComplaintById(complaintId) {
    const query = `
      SELECT *
      FROM complaint_get_by_id($1)
    `;
    const params = [complaintId];
    const result = await executeQuery(query, params);
    return result[0];
  },

  
  /**
   * Get complaints by retailer ID with pagination.
   * @param {number} retailerId - Retailer ID.
   * @param {number} pageSize - Number of records per page.
   * @param {number} pageIndex - Page index for pagination.
   * @returns {Promise<Array>} List of complaints.
   */
  async getComplaintsByRetailer(retailerId, pageSize, pageIndex) {
    const query = `
      SELECT *
      FROM get_complaints_by_retailer($1, $2, $3)
    `;
    const params = [retailerId, pageSize, pageIndex];
    return await executeQuery(query, params);
  },

  /**
   * Get complaints by supplier ID with pagination.
   * @param {number} supplierId - Supplier ID.
   * @param {number} pageSize - Number of records per page.
   * @param {number} pageIndex - Page index for pagination.
   * @returns {Promise<Array>} List of complaints.
   */
  async getComplaintsBySupplier(supplierId, pageSize, pageIndex) {
    const query = `
      SELECT *
      FROM get_complaints_by_supplier($1, $2, $3)
    `;
    const params = [supplierId, pageSize, pageIndex];
    return await executeQuery(query, params);
  },

  /**
   * Insert a new complaint.
   * @param {Object} complaintData - Data for the new complaint.
   * @returns {Promise<number>} Inserted complaint ID.
   */
  async insertComplaint(complaintData) {
    const query = `
      SELECT *
      FROM complaint_insert(
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
    `;
    const params = [
      complaintData.complaintTitle,
      complaintData.complaintTypeId,
      complaintData.reviewerId,
      complaintData.supplierId,
      complaintData.retailerId,
      complaintData.complaintStatusId,
      complaintData.complaintNotes,
      complaintData.submitterType,
      complaintData.creationDate,
      complaintData.lastModifiedBy,
      complaintData.resolutionNotes,
      complaintData.quotationId,
    ];
    const result = await executeQuery(query, params);
    return result;
  },

  /**
   * Update an existing complaint.
   * @param {Object} updateData - Data for updating the complaint.
   * @returns {Promise<number>} Update result.
   */
  async updateComplaint(updateData) {
    const query = `
      SELECT *
      FROM complaint_update(
        $1, $2, $3, $4, $5
      )
    `;
    const params = [
      updateData.reviewerId,
      updateData.complaintStatusId,
      updateData.lastModifiedBy,
      updateData.resolutionNotes,
      updateData.complaintId,
    ];
    const result = await executeQuery(query, params);
    return result;
  },

  /**
   * Soft delete a complaint by marking its status as 'DELETED'.
   * @param {number} complaintId - Complaint ID.
   * @param {number} lastModifiedBy - ID of the user performing the deletion.
   * @returns {Promise<number>} Deletion result.
   */
  async deleteComplaint(complaintId, lastModifiedBy) {
    const query = `
      SELECT *
      FROM complaint_delete($1, $2)
    `;
    const params = [complaintId, lastModifiedBy];
    const result = await executeQuery(query, params);
    return result[0];
  },
};

module.exports = Complaint;
