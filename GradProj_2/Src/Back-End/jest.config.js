module.exports = {
  testEnvironment: "node", // Use Node.js environment
  roots: ["<rootDir>/tests"], // Directory where test files are located
  testMatch: ["**/*.test.js"], // Match all files ending with .test.js
  collectCoverage: true, // Enable code coverage reporting
  collectCoverageFrom: ["models/**/*.js"], // Collect coverage data from model files
  coverageDirectory: "coverage", // Output coverage report to 'coverage' folder
  verbose: true, // Show detailed test output
};
