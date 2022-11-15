const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner_ids: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  parent_groups: {
    type: [Schema.Types.ObjectId],
    ref: "Group",
  },
  child_groups: {
    type: [Schema.Types.ObjectId],
    ref: "Group",
  },
});

module.exports = mongoose.model("Group", groupSchema);
