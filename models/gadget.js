var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const gadgetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tier: {
        type: String,
        enum: ["Basic", "Good", "Rare"],
        default: 'Basic'
    },
    category: {
        type: String,
        enum: ["Headwear", "Weapon", "Clothing"],
        default: "Weapon"
    },
    icon: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    }
}, {
    collection: 'gadgets'
})

const Gadget = mongoose.model('gadgets', gadgetSchema);
module.exports = Gadget;