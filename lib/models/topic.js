const mongoose = require( "mongoose" );

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    meeting: { type: Schema.Types.ObjectId, ref: "Meeting" },
    likes: [{ type: Schema.Types.ObjectId, ref: "Participant" }]
  },
  {
    timestamp: true
  }
);

module.exports = mongoose.model( "Topic", topicSchema );