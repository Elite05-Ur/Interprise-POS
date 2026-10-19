const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/auth.route');
const productRoutes = require('./routes/product.route');
const purchaseRoutes = require('./routes/purchase.route');
const saleRoutes = require('./routes/sale.route');
const backupRoutes = require('./routes/backup.route');
const tillClosingRoutes = require('./routes/tillClosing.routes');
const userRoutes = require('./routes/user.route');



// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/till', tillClosingRoutes);
app.use('/api/users', userRoutes);


// Test Route
app.get('/', (req, res) => {
  res.send('MERN POS & Inventory System API is running...');
});


// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


module.exports = app;