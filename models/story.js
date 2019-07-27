var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const storySchema = new Schema({
  author: {
    type: ObjectId,
    required: true,
    ref: "users"
  },
  writtenAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  text: [{
    type: String,
    required: true
  }],
  likes: [{
    type: ObjectId,
    ref: 'users',
    default: []
  }]
}, {
  collection: 'stories'
})

const Story = mongoose.model('stories', storySchema);
module.exports = Story;