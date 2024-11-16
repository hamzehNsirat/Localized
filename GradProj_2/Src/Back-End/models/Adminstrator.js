// Administrator Model
const executeQuery = require("../config/database"); // Database connection

const Administrator = {
  async getAllAdministrators() {
    return await executeQuery("SELECT * FROM adminstrators_get()", []);
  },

  async insertAdministrator(lastModifiedBy) {
    return await executeQuery(
      "SELECT adminstrators_insert($1) AS execution_result",
      [lastModifiedBy]
    );
  },

  async deleteAdministrator(adminId, lastModifiedBy) {
    return await executeQuery(
      "SELECT adminstrators_delete($1, $2) AS execution_result",
      [adminId, lastModifiedBy]
    );
  },
};

module.exports = Administrator;
