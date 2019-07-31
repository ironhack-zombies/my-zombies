const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const ownedGadgetSchema = new Schema({
    origin: { type: ObjectId, ref: 'gadgets' },
    attachedTo: {
        type: ObjectId,
        ref: 'ownedZombies'
    }
}, { collection: 'ownedGadgets' })

const OwnedZombie = mongoose.model('ownedGadgets', ownedGadgetSchema);

module.exports = OwnedZombie;