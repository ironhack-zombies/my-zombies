const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const tokenSchema = new mongoose.Schema({
    _userId: {
        type: ObjectId,
        required: true,
        ref: "users"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 12 * 60 * 60
    }
}, {
    collection: 'tokens'
})

const Token = mongoose.model('tokens', tokenSchema);
module.exports = Token;