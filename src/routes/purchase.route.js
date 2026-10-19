const express = require('express');
const router = express.Router();
const {
  createPurchase,
  getAllPurchases,
} = require('../controllers/purchase.controller');
const { protect } = require('../middleware/auth.middleware');

// Staff aur Admin dono purchase entry kar sakte hain (Token zaroori hai)
router.post('/', protect, createPurchase);

// Purchase history dekhne ke liye route
router.get('/', protect, getAllPurchases);

module.exports = router;