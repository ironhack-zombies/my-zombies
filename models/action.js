var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const actionSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Recovery"],
    required: true
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  }
}, {
  collection: 'actions'
})

const Action = mongoose.model('actions', actionSchema);
Action.on('index', function(error) {
  if(error)console.log(error)
});
module.exports = Action;