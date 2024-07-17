const express = require('express');
const adminController = require('../controller/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/view-users', authMiddleware.authenticate, roleMiddleware.requireAdmin, adminController.viewUsers);
router.get('/search-user', authMiddleware.authenticate, roleMiddleware.requireAdmin, adminController.searchUser); 
router.get('/view-transactions', authMiddleware.authenticate, roleMiddleware.requireAdmin, adminController.viewAllTransactions);
router.post('/approve-user', authMiddleware.authenticate, roleMiddleware.requireAdmin, adminController.manageUserAccount);


module.exports = router;
