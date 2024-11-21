// Initializes the server and listens on the specified port
const app = require("./app"); // Import configured app
const keys = require("./config/keys"); // Import essential configurations
const logger = require("./utils/logger");
// Start the server
app.listen(keys.port, () => {
  console.log(`Server running in ${keys.environment} mode on ${keys.baseUrl}`);
});
