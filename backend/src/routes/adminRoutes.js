const express = require('express');
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/audit-logs', adminController.getAuditLogs);
router.get('/users', adminController.getAllUsers);
router.get('/stats', adminController.getSystemStats);

module.exports = router;
