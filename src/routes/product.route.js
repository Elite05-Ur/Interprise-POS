const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Public / POS & Admin saare products dekh sakte hain (Token zaroori hai ya nahi, aap protect laga ya hata saktay hain)
router.get('/', protect, getAllProducts);

// Admin Only Routes (Sirf Admin product add, update ya delete kar sakta hai)
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;