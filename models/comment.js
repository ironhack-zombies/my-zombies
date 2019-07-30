var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new Schema({
  author: {
    type: ObjectId,
    required: true,
    ref: "users"
  },
  writtenAt: {
    type: Date,
    default: Date.now
  },
  text: [{
    type: String,
    required: true
  }],
  story: {
    type: ObjectId,
    ref: 'stories',
    required: true
  }
}, {
  collection: 'comments'
})

const Story = mongoose.model('comments', commentSchema);
module.exports = Story;