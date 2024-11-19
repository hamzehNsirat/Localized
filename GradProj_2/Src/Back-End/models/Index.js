// Centralized export for all models and initialization.
const pool = require("../config/database");

(async () => {
  try {
    const res = await pool.executeQuery("SELECT NOW()");
    console.log("Database Time:", res.rows[0]);
  } catch (err) {
    console.error("Database Connection Error:", err.message);
  }
})();
