const express = require('express');
const adminController = require('../controller/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/users', authMiddleware.authenticate, roleMiddleware.requireAdmin, adminController.viewUsers);
router.get('/search-user', authMiddleware.authenticate, roleMiddleware.requireAdmin, adminController.searchUser);
router.post('/approve-user', authMiddleware.authenticate, roleMiddleware.requireAdmin, adminController.manageUserAccount);
router.get('/transactions', authMiddleware.authenticate, roleMiddleware.requireAdmin, adminController.viewAllTransactions);

module.exports = router;
