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
    gadgetsOwned: [{ type: ObjectId, ref: 'gadgets' }],
    likedStories: [{ type: ObjectId, ref: 'stories' }],
    profileImage: {
        type: String
    },
    brains: {
        type: Number,
        default: 0
    },
    timeStart: {
        type: Number,
        default: 0
    },
    hourLeft: {
        type: Number
    },
    minLeft: {
        type: Number
    },
    secLeft: {
        type: Number
    }
}, {
    collection: 'users'
})

const User = mongoose.model('users', userSchema);
module.exports = User;