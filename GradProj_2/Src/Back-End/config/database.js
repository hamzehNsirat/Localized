/* // Sets up the Sequelize configuration for PostgreSQL

const { Sequelize } = require('sequelize');
const keys = require('../keys'); // Import keys.js

const sequelize = new Sequelize(
    keys.dbName,
    keys.dbUser,
    keys.dbPass,
    {
        host: keys.dbHost,
        port: keys.dbPort,
        dialect: keys.dbDialect,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

async function authenticateConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
authenticateConnection();  // Test the connection upon initialization

module.exports = sequelize; */

const { Pool } = require("pg");

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

// Utility function to execute database queries
async function executeQuery(query = "", params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  executeQuery,
  pool
};
