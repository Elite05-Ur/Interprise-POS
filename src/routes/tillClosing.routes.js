const express = require('express');
const router = express.Router();
const { submitTillClosing, getAllTillClosings } = require('../controllers/till.controller');
const { protect, } = require('../middleware/auth.middleware'); // Apne auth middleware ka path check kar lena

// Cashier till close submit karega
router.post('/close', protect, submitTillClosing);

// Admin saari till closing reports dekhega
router.get('/reports', protect, getAllTillClosings);

module.exports = router;