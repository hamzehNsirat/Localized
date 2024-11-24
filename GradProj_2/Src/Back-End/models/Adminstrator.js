// Administrator Model
const { executeQuery } = require("../config/database");

const Administrator = {
  async getAllAdministrators() {
    return await executeQuery("SELECT * FROM adminstrators_get()", []);
  },

  async insertAdministrator(lastModifiedBy, user_id) {
    return await executeQuery(
      "SELECT * FROM adminstrators_insert($1, $2)",
      [user_id, lastModifiedBy]
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
