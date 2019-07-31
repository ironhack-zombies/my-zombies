const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ownedZombieSchema = new Schema({
    nickname: { type: String, required: true },
    gadgets: [{ type: ObjectId, ref: 'ownedGadgets', default: {} }],
    currentState: { type: ObjectId, ref: 'actions' },
    owner: { type: ObjectId, ref: 'users' },
    origin: { type: ObjectId, ref: 'zombies' },
    fightsWon: {
        type: Number,
        default: 0
    },
    experiance: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    power: {
        type: Number,
        default: 1
    }
}, { collection: 'ownedZombies' })

const OwnedZombie = mongoose.model('ownedZombies', ownedZombieSchema);

module.exports = OwnedZombie;