const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
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
    image: {
        // will make an object for Images that user upload as profile picture 
        type: ObjectId,
        ref: 'images'
    },
    brains: {
        type: Number
    }
})

const User = mongoose.model('users', userSchema);
module.exports = User;