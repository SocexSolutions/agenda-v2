const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const meetingSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    participants: [ { type: Schema.Types.ObjectId, ref: "Participant" } ],
    date: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model( "Meeting", meetingSchema );
