// Query Parameters Handlers
function handleArray(inputArray) {
  if (!Array.isArray(inputArray)) {
    throw new Error("Provided parameter is not an array.");
  }
  return `{${inputArray.map((item) => JSON.stringify(item)).join(",")}}`;
}
function handleJsonB(jsonObject) {
  if (typeof jsonObject !== "object" || jsonObject === null) {
    throw new Error("Provided parameter is not a valid JSON object.");
  }
  return JSON.stringify(jsonObject);
}
// Database Connection
const { Pool } = require("pg");
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "5432",
  database: process.env.DB_NAME || "Localized",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "admin",
});

// Handle Each Atomic Transaction
let transactionalClient = null;
/**
 * Starts a transaction by acquiring a database client.
 */
const beginTransaction = async () => {
  if (transactionalClient) {
    throw new Error("A transaction is already in progress!");
  }
  transactionalClient = await pool.connect();
  await transactionalClient.query("BEGIN");
};
/**
 * Executes a query within a transaction or standalone, depending on the context.
 * Automatically determines whether to use the transactional client or pool.
 *
 * @param {string} query - The SQL query to execute.
 * @param {Array} params - The parameters for the query.
 * @returns {Promise<any>} - Query result rows.
 */
const executeQuery = async (query, params = []) => {
  const client = transactionalClient || pool; // Use transactional client if set, otherwise the pool
  // Preprocess parameters
  const formattedParams = params.map((param) => {
    if (Array.isArray(param)) {
      // Convert JavaScript array to PostgreSQL array format
      return handleArray(param);
    }
    if (typeof param === "object" && param !== null) {
      // Convert JavaScript object to PostgreSQL JSONB format
      return handleJsonB(param);
    }
    return param; // Pass other types (e.g., strings, numbers) directly
  });
  try {
    const result = await client.query(query, formattedParams);
    return result.rows;
  } catch (error) {
    console.error("Database Query Error:", error.message);
    throw error;
  }
};
/**
 * Commits the current transaction and releases the transactional client.
 */
const commitTransaction = async () => {
  if (!transactionalClient) {
    throw new Error("No transaction in progress to commit!");
  }
  try {
    await transactionalClient.query("COMMIT");
  } catch (error) {
    console.error("Error during transaction commit:", error.message);
    throw error;
  } finally {
    transactionalClient.release();
    transactionalClient = null;
  }
};
/**
 * Rolls Back the current transaction and releases the transactional client.
 */
const rollbackTransaction = async () => {
  if (!transactionalClient) {
    throw new Error("No transaction in progress to rollback!");
  }
  try {
    await transactionalClient.query("ROLLBACK");
  } catch (error) {
    console.error("Error during transaction rollback:", error.message);
    throw error;
  } finally {
    transactionalClient.release();
    transactionalClient = null;
  }
};

module.exports = {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  handleArray,
  handleJsonB,
};
