const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser ,updateUser} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware'); // Apne auth middleware ka path check kar lena
const { adminOnly } = require('../middleware/role.middleware');

// Get all users (Admin only)
router.get('/', protect, adminOnly, getAllUsers);

// Delete user (Admin only)
router.delete('/:id', protect, adminOnly, deleteUser);

router.put('/:id', protect, adminOnly, updateUser);
module.exports = router;