const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    from: { type: String, ref: 'User', required: true},
    to: { type: String, ref: 'User', required: true},
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    type: { type: String, enum: ['send', 'cashout', 'cashin'], required: true },
    date: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending',
        validate: {
            validator: function(v) {
                if (this.type === 'send') {
                    return true; // When type is 'send', any value or no value for status is valid
                }
                return v != null; // When type is not 'send', status must be present
            },
            message: props => `Status is required when type is not 'send'.`
        }
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
