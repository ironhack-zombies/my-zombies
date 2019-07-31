const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ownedZombieSchema = new Schema({
    nickname: { type: String, required: true },
    gadgets: [{ type: ObjectId, ref: 'gadgets', default: {} }],
    currentState: { type: ObjectId, ref: 'actions' },
    owner: { type: ObjectId, ref: 'users' },
    origin: { type: ObjectId, ref: 'zombies' }
}, { collection: 'ownedZombies' })

const OwnedZombie = mongoose.model('ownedZombies', ownedZombieSchema);

module.exports = OwnedZombie;