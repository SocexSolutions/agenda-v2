const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const takeawaySchema = new Schema({
  content: {
    type: String,
    required: true
  },
  topic_id: {
    type: Schema.Types.ObjectId, ref: 'Topic',
    required: true
  },
  reactions: [ {
    type: String
  } ],
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model( 'Takeaway', takeawaySchema );
