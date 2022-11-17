const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invite = new mongoose.Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invitee: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "accepted", "rejected", "cancelled"],
    required: true,
    default: "open",
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
});

module.exports = mongoose.model("Invite", invite);
