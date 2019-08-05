var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    zombiesOwned: [{ type: ObjectId, ref: 'ownedZombies' }],
    gadgetsOwned: [{ type: ObjectId, ref: 'ownedGadgets' }],
    profileImage: {
        type: String
    },
    brains: {
        type: Number,
        default: 15
    },
    timeStart: {
        type: Number,
        default: 0
    },
    fightsWon: {
        type: Number,
        default: 0
    },
    // new changes
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    collection: 'users'
})

const User = mongoose.model('users', userSchema);
module.exports = User;