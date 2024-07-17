const User = require('../models/user');
const Transaction = require('../models/transaction');
const jwt = require('../utils/jwt');
const mongoose = require('mongoose');
exports.registerUser = async (req, res) => {
    try {
        const { name, pin, mobileNumber, role } = req.body;
             // Validate mobile number (Bangladeshi number: starts with 01 and has 11 digits)
             const mobileNumberRegex = /^01[0-9]{9}$/;
             if (!mobileNumberRegex.test(mobileNumber)) {
                 return res.status(400).send({ error: 'Invalid mobile number. It must be a valid Bangladeshi number.' });
             }
     
             // Validate pin (6 digits)
             const pinRegex = /^[0-9]{6}$/;
             if (!pinRegex.test(pin)) {
                 return res.status(400).send({ error: 'Invalid pin. It must be exactly 6 digits.' });
             }
        const user = new User({ name, pin, mobileNumber, role});
        await user.save();
        res.status(201).send({ message: 'User registered. Await admin approval.' });
    } catch (err) {
        res.status(500).send({ error: 'Server error. Could not register user.' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { mobileNumber, pin } = req.body;
        console.log(req.body);

   
       console.log(mobileNumber, pin);
       
       
        const user = await User.findOne({mobileNumber});

        //console.log(user);

        if (!user || !(await user.comparePin(pin))) {
            return res.status(400).send({ error: 'Invalid credentials.' });
        }

        // Check if the user status is 'active'
        if (user.status !== 'active') {
            return res.status(400).send({ error: 'Your account is not active. Please contact support.' });
        }

        const token = jwt.generateToken(user);

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.send({ message: 'Login successful.', token });
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server error. Could not log in user.' });
    }
};

exports.sendMoney = async (req, res) => {
    try {
       
        const {to, amount, pin } = req.body;
       // console.log(req.body);
        const user = await User.findById(new mongoose.Types.ObjectId(req.user._id));
        

        //console.log(user);
        if (!(await user.comparePin(pin))) {
            return res.status(400).send({ error: 'Invalid PIN.' });
        }
        if (amount < 50) {
            return res.status(400).send({ error: 'Minimum transaction amount is 50 Taka.' });
        }
        const fee = amount > 100 ? 5 : 0;
        const totalAmount = Number(amount) + Number(fee);
        console.log(totalAmount);
        if (user.balance < totalAmount) {
            return res.status(400).send({ error: 'Insufficient balance.' });
        }
        const recipient = await User.findById({mobileNumber : to});
        if (!recipient) {
            return res.status(404).send({ error: 'Recipient not found.' });
        }

        user.balance -= totalAmount;

        recipient.balance += Number(amount);

        await user.save();
        await recipient.save();
        const transaction = new Transaction({
            from: user.mobileNumber,
            to: to,
            amount,
            fee,
            type: 'send'
        });
        await transaction.save();
        res.send({ message: 'Transaction successful.' });
    } catch (err) {
        res.status(500).send({ error: 'Server error. Could not complete transaction.' });
    }
};

exports.cashInRequest = async (req , res) => {
    try {
        const {to, amount , pin} = req.body;
        const user = await User.findById(new mongoose.Types.ObjectId(req.user._id))

        if(!user){
            return res.status(404).send({ error: 'User not found.' });
        }
        if (!(await user.comparePin(pin))) {
            return res.status(400).send({ error: 'Invalid PIN.' });
        }
        if (user.balance < amount) {
            return res.status(400).send({ error: 'Insufficient balance.' });
        }
        const agent = await User.findOne({mobileNumber : to})
       if(!agent){
        return res.status(404).send({ error: 'Agent not found.' });
       }

       const transaction = new Transaction({
        from : user.mobileNumber,
        to: to, 
        amount,
        type: 'cashin',
    });

    await transaction.save();

        res.status(201).send({message : "SuccessFully request"}, transaction);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

exports.createCashoutRequest = async (req, res) => {
    try {
        const { to, amount, pin } = req.body;

        if (amount < 50) {
            return res.status(400).send({ error: 'Minimum cashout amount is 50 Taka.' });
        }
        

        const user = await User.findOne({mobileNumber : req.user.mobileNumber});


        console.log(user);
        if (!user) {
            return res.status(404).send({ error: 'User not found.' });
        }

        if (!(await user.comparePin(pin))) {
            return res.status(400).send({ error: 'Invalid PIN.' });
        }

        if (user.balance < amount) {
            return res.status(400).send({ error: 'Insufficient balance.' });
        }
        const agent = await User.findOne({mobileNumber : to})

       if(!agent){
        return res.status(404).send({ error: 'Agent not found.' });
       }

        const transaction = new Transaction({
            from : user.mobileNumber,
            to: to, 
            amount,
            type: 'cashout',
        });

        await transaction.save();
        res.status(201).send({message : "SuccessFully request"},transaction);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};



exports.getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.send({ balance: user.balance });
    } catch (err) {
        res.status(500).send({ error: 'Server error. Could not retrieve balance.' });
    }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const transactions = await Transaction.find({
            $or: [{ from: user.mobileNumber}, { to: user.mobileNumber }]
        })
        .sort({ date: -1 })
        .limit(10);
        res.send(transactions);
    } catch (err) {
        res.status(500).send({ error: 'Server error. Could not retrieve transactions.' });
    }
};

