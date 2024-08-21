const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionErrorSchema = new Schema({
    message: { type: String, required: true },
    stack: { type: String },
    date: { type: Date, default: Date.now }
});

const TransactionError = mongoose.model('TransactionError', transactionErrorSchema);

module.exports = TransactionError;
