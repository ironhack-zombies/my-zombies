var mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    firstName: {
        type: String
    },
    lastName: {
        type: String
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
}, {
    collection: 'users'
})

const User = mongoose.model('users', userSchema);
module.exports = User;