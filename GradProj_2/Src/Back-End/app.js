// Configures the main Express app, adds middleware, and sets up routing
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const keys = require("./config/keys");            // Load essential configurations
const logRequest = require("./middlewares/logRequest");            // References Request/Response Logger
const path = require("path"); // Import path module
const app = express(); // Initialize Express app
// Global Middleware Configuration

// CORS
app.use(cors({
    origin: keys.allowedOrigins,
    credentials: true
}));

// Rate Limiting
// app.use(rateLimit({
//     windowMs: keys.rateLimitWindow * 60 * 1000,  // Convert minutes to milliseconds
//     max: keys.rateLimitMaxRequests
// }));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*
uncomment to log incoming requests and corresponding responses
app.use(logRequest);
*/
 

// Route Handlers

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const retailerRoutes = require("./routes/retailerRoutes");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const imageUpload = require("./config/images");
// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/retailer", retailerRoutes);
app.use('/api/quotations', quotationRoutes);
// IMAGE HANDLING
app.use("/uploads/images", imageUpload);
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads/images"))
);
//
// unfinished
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/quotations', quotationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred!' });
});



module.exports = app;
