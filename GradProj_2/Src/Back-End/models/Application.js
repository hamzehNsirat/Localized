const { executeQuery } = require("../config/database"); // Assuming executeQuery is your database utility function

const Application = {
  /**
   * Get all applications with pagination.
   * @param {number} pageSize - The number of rows to fetch.
   * @param {number} pageIndex - The page index for pagination.
   * @returns {Promise<Array>} - List of applications.
   */
  async getAllApplications(pageSize, pageIndex) {
    return await executeQuery("SELECT * FROM application_get_all($1, $2);", [
      pageSize,
      pageIndex,
    ]);
  },

  /**
   * Get application details by ID.
   * @param {number} applicationId - The ID of the application.
   * @returns {Promise<Object>} - The application data.
   */
  async getApplicationById(applicationId) {
    return await executeQuery("SELECT * FROM application_get_by_id($1);", [
      applicationId,
    ]);
  },

  /**
   * Insert a new application.
   * @param {Object} applicationData - The application data to insert.
   * @returns {Promise<number>} - The ID of the newly created application.
   */
  async insertApplication(applicationData) {
    const query = `
      SELECT * FROM application_insert(
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) AS out_application_id;
    `;
    const values = [
      applicationData.firstName,
      applicationData.lastName,
      applicationData.userName,
      applicationData.email,
      applicationData.password,
      applicationData.phoneNumber,
      applicationData.establishmentName,
      applicationData.establishmentContactNumber,
      applicationData.establishmentEmail,
      applicationData.establishmentDescription,
      applicationData.establishmentCommercialRegistrationNum,
      applicationData.establishmentCity,
      applicationData.establishmentStreet,
      applicationData.establishmentBuildingNum,
      applicationData.establishmentIndustryType,
      applicationData.establishmentLogo,
      applicationData.userType,
    ];

    const result = await executeQuery(query, values);
    return result[0]?.out_application_id || null;
  },

  /**
   * Check application status by email, username, and password.
   * @param {string} userEmail - The user's email.
   * @param {string} userName - The user's username.
   * @param {string} userPassword - The user's password.
   * @returns {Promise<string>} - The status of the application.
   */
  async checkApplicationStatus(userEmail, userName, userPassword) {
    const query = `
      SELECT * FROM application_check_status($1, $2, $3);
    `;
    const result = await executeQuery(query, [
      userEmail,
      userName,
      userPassword,
    ]);
    return result[0]?.out_application_status || null;
  },

  /**
   * Update the status of an application.
   * @param {number} applicationId - The application ID to update.
   * @param {string} applicationStatus - The new application status.
   * @returns {Promise<number>} - 0 for success, -1 for error.
   */
  async updateApplicationStatus(applicationId, applicationStatus) {
    const query = `
      SELECT * FROM application_update_status($1, $2);
    `;
    const result = await executeQuery(query, [
      applicationId,
      applicationStatus,
    ]);
    return result[0]?.result || -1;
  },

  // Search Application
  async searchApplication(searchTerm, pageSize, pageIndex) {
    const query = `
            SELECT * FROM application_search($1, $2, $3)
        `;
    try {
      return await executeQuery(query, [searchTerm, pageSize, pageIndex]);
    } catch (error) {
      console.error("Error in searchApplication:", error);
      throw error;
    }
  },
};

module.exports = Application;
