// Sets up the Sequelize configuration for PostgreSQL

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

module.exports = sequelize;
