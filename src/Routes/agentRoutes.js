const express = require('express');
const agentController = require('../controller/agentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/approve-cashout', authMiddleware.authenticate, roleMiddleware.requireAgent, agentController.approveCashout);
 router.post('/approve-cashin', authMiddleware.authenticate, roleMiddleware.requireAgent, agentController.approveCashIn);
/* router.get('/balance', authMiddleware.authenticate, roleMiddleware.requireAgent, agentController.getBalance); */

module.exports = router;
