const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tag = new mongoose.Schema({
  group_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    enum: [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "pink",
      "indigo",
    ],
    default: "red",
  },
});

module.exports = mongoose.model("Tag", tag);
