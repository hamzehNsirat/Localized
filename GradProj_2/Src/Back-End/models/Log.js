const { executeQuery } = require("../config/database");
const Log = {
  async getLogByUserId(logUserId) {
    return await executeQuery("SELECT * FROM log_get_by_userid($1)", [
      logUserId,
    ]);
  },

  async insertLog(inputData) {
    return await executeQuery(
      "SELECT log_insert($1, $2, $3, $4, $5) AS out_log_id",
      [
        inputData.logUserId,
        inputData.actionDetails,
        inputData.actionJsonPayload,
        inputData.actionDescription,
        inputData.isTransactional,
      ]
    );
  },
};
module.exports = Log;
