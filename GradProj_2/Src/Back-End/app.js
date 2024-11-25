// Configures the main Express app, adds middleware, and sets up routing
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const keys = require("./config/keys");            // Load essential configurations
const logRequest = require("./middlewares/logRequest");            // References Request/Response Logger

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
app.use(logRequest);

// Route Handlers

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const quotationRoutes = require('./routes/quotationRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
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
