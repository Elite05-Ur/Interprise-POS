const express = require('express');
const router = express.Router();
const {
  createSale,
  getAllSales,
  returnSale,
  getStaffClosingReport,
} = require('../controllers/sale.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// POS Checkout Sale Route (Staff / Admin)
router.post('/', protect, createSale);

// Staff-wise Closing Report Route (Admin Only - C1 vs C2 breakdown)
router.get('/closing-report', protect, adminOnly, getStaffClosingReport);

// Saari Sales History
router.get('/', protect, getAllSales);

// Sale Return / Refund Route
router.put('/return/:id', protect, returnSale);

module.exports = router;