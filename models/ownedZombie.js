const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownedZombieSchema = new Schema({
    nickname: { type: String },
    gadgets: [{ type: ObjectId, ref: 'gadgets' }],
    currentState: { type: ObjectId, ref: 'actions' },
    origin: { type: ObjectId, ref: 'zombies' }
}, { collection: 'ownedZombies' })

const OwnedZombie = mongoose.model('ownedZombies', ownedZombieSchema);
module.exports = OwnedZombie;