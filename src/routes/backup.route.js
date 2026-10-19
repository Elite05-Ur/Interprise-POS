const express = require('express');
const router = express.Router();
const { downloadCSVBackup } = require('../controllers/backup.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Admin Only: CSV Backup Download Route
router.get('/generate', protect, adminOnly, downloadCSVBackup);

module.exports = router;