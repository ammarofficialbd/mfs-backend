const Transaction = require('../models/transaction');
const User = require('../models/user');

exports.approveCashout = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const agent = await User.findById(req.user._id);
        const transaction = await Transaction.findById(transactionId);

        if (!transaction || transaction.type !== 'cashout' || transaction.status !== 'pending') {
            return res.status(400).send({ error: 'Invalid transaction.' });
        }

        const user = await User.findOne({mobileNumber : transaction.from});
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        if (user.balance < transaction.amount) {
            return res.status(400).send({ error: 'Insufficient balance.' });
        }

        user.balance = Number(user.balance) - Number(transaction.amount);
        agent.balance =  Number(agent.balance) + Number(transaction.amount);

        transaction.status = 'approved';
        transaction.agent = agent._id;

        await user.save();
        await agent.save();
        await transaction.save();

        res.send(transaction);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.approveCashIn = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const agent = await User.findById(req.user._id);
        const transaction = await Transaction.findById(transactionId);

        if (!transaction || transaction.type !== 'cashin' || transaction.status !== 'pending') {
            return res.status(400).send({ error: 'Invalid transaction.' });
        }

        const user = await User.findOne({mobileNumber : transaction.from});
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        if (agent.balance < transaction.amount) {
            return res.status(400).send({ error: 'Insufficient balance.' });
        }

        agent.balance = Number(agent.balance) - Number(transaction.amount);
        user.balance = Number(user.balance) + Number(transaction.amount);
        

        transaction.status = 'approved';
        transaction.agent = agent._id;

        await user.save();
        await agent.save();
        await transaction.save();

        res.send(transaction);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

