const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zombieSchema = new Schema({
    type: String,
    desciption: Array,
    ability: Array,
    origin: Array,
    image: String,
    price: Number
}, { collection: 'zombies' })

const Zombie = mongoose.model('zombies', zombieSchema);
module.exports = Zombie;