const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new mongoose.Schema(
  {
    owner_id: { type: Schema.Types.ObjectId, ref: "User" },
    date: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);
