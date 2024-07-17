const User = require('../models/user');
const Transaction = require('../models/transaction');
const mongoose = require('mongoose');


exports.viewUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send({ error: 'Server error. Could not retrieve users.' });
    }
};

exports.searchUser = async (req, res) => {
    try {
        const { name } = req.query;
        const users = await User.find({ name: new RegExp(name, 'i') });
        res.send(users);
    } catch (err) {
        res.status(500).send({ error: 'Server error. Could not search users.' });
    }
};

exports.manageUserAccount = async (req, res) => {
    try {
        const { userId, action } = req.body;
        console.log(req.body);
        const user = await User.findById(new mongoose.Types.ObjectId(userId));
        console.log(user);
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }
        if (action === 'activate') {
            user.status = 'active';
            if (user.role === 'user') {
                user.balance += 40;  // Adding 40 Taka bonus for users
            } else if (user.role === 'agent') {
                user.balance += 10000;  // Adding 10,000 Taka bonus for agents
            }
        } else if (action === 'block') {
            user.status = 'blocked';
        }
        await user.save();
        res.send({ message: `User ${action}d successfully.` });
    } catch (err) {
        res.status(500).send({ error: 'Server error. Could not manage user account.' });
    }
};

exports.viewAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.send(transactions);
    } catch (err) {
        res.status(500).send({ error: 'Server error. Could not retrieve transactions.' });
    }
};
