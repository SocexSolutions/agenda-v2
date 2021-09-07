const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    meeting_id: { type: Schema.Types.ObjectId, ref: "Meeting", required: true },
    likes: [ { type: Schema.Types.ObjectId, ref: "Participant" } ],
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model( "Topic", topicSchema );
