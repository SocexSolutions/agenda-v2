const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actionItemSchema = new Schema({
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
  completed: {
    type: Boolean,
    default: false,
  },
  assigned_to: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("ActionItem", actionItemSchema);
