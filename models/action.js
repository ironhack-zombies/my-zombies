var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const actionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    required: true
  }
}, {
  collection: 'actions'
})

const Action = mongoose.model('actions', actionSchema);
module.exports = Action;