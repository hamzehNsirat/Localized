// Configures the main Express app, adds middleware, and sets up routing

// Import Handlers for Application
const express = require('express'); 
const cors = require('cors');
const keys = require("./config/keys");
const logRequest = require("./middlewares/logRequest");
const path = require("path");
const app = express();

// Configure Incoming Request Handling
app.use(cors({
    origin: keys.allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*
uncomment to log incoming requests and corresponding responses
app.use(logRequest);
*/
// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const platformComplianceRoutes = require("./routes/platformComplianceRoutes");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const imageUpload = require("./config/images");
// Mount routes
/*
Business Routes
*/
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/quotations', quotationRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/platformservices", platformComplianceRoutes);
app.use('/api/products', productRoutes);
/*
Utitlity Routes
*/
app.use("/uploads/images", imageUpload);
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "usables/uploads/images"))
);
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred!' });
});

module.exports = app;
