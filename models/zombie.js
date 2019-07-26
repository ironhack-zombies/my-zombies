const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zombieSchema = new Schema({
    type: { type: String },
    desciption: [{ type: String }],
    abilities: [{ type: String }],
    references: [{ type: String }],
    image: { type: String },
    price: { type: Number }
}, { collection: 'zombies' })

const Zombie = mongoose.model('zombies', zombieSchema);
module.exports = Zombie;