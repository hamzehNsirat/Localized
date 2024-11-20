/**
 * Converts a JavaScript array into a PostgreSQL-compatible array string.
 * If the input is not an array, it throws an error.
 * 
 * @param {Array} inputArray - The JavaScript array to format.
 * @returns {string} - A PostgreSQL-compatible array string.
 */
function handleArray(inputArray) {
  if (!Array.isArray(inputArray)) {
    throw new Error("Provided parameter is not an array.");
  }
  return `{${inputArray.map(item => JSON.stringify(item)).join(',')}}`;
}
/**
 * Converts a JavaScript object into a PostgreSQL-compatible JSONB string.
 * If the input is not an object, it throws an error.
 * 
 * @param {Object} jsonObject - The JavaScript object to format.
 * @returns {string} - A PostgreSQL-compatible JSONB string.
 */
function handleJsonB(jsonObject) {
  if (typeof jsonObject !== "object" || jsonObject === null) {
    throw new Error("Provided parameter is not a valid JSON object.");
  }
  return JSON.stringify(jsonObject);
}



const { Pool } = require("pg");

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "5432",
  database: process.env.DB_NAME || "Localized",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "admin",
});

/**
 * Executes a query with properly formatted parameters.
 *
 * @param {string} query - The SQL query to execute.
 * @param {Array} params - The parameters to pass into the query.
 * @returns {Promise} - A promise resolving with the query result.
 */
async function executeQuery(query, params) {
  const formattedParams = params.map((param) => {
    if (Array.isArray(param)) {
      return handleArray(param);
    }
    if (typeof param === "object" && param !== null) {
      return handleJsonB(param);
    }
    return param; // Pass other types (e.g., strings, numbers) directly.
  });

  try {
    const result = await pool.query(query, formattedParams);
    return result.rows;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
}

module.exports = { executeQuery, handleArray, handleJsonB, pool };
