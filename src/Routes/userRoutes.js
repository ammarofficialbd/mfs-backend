const express = require('express');
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/send-money', authMiddleware.authenticate,userController.sendMoney);
router.post('/cashout', authMiddleware.authenticate, userController.createCashoutRequest);
router.post('/cashin', authMiddleware.authenticate, userController.cashInRequest);
router.get('/balance', authMiddleware.authenticate, userController.getBalance);
router.get('/transaction', authMiddleware.authenticate, userController.getTransactionHistory);





module.exports = router;
