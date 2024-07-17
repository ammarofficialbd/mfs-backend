const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    type: { type: String, enum: ['send', 'cashout', 'cashin'], required: true },
    date: { type: Date, default: Date.now },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
