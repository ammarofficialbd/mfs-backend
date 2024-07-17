const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pin: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'active', 'blocked'], default: 'pending' },
    balance: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('pin')) return next();
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
});

userSchema.methods.comparePin = function (inputPin) {
    return bcrypt.compare(inputPin, this.pin);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
