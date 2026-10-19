const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Public Route (Login sab ke liye open hai)
router.post('/login', loginUser);

// Protected & Admin Only: Naya Staff / Admin register karne ka route
router.post('/register', protect, adminOnly, registerUser);

// Protected Route (Logged-in user ka profile dekhne ke liye)
router.get('/profile', protect, getUserProfile);

module.exports = router;