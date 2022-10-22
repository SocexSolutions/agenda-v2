const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const takeawaySchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  topic_id: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
    index: true,
  },
  reactions: [
    {
      type: String,
    },
  ],
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meeting_id: {
    type: Schema.Types.ObjectId,
    ref: "Meeting",
    required: true,
  },
});

module.exports = mongoose.model("Takeaway", takeawaySchema);
