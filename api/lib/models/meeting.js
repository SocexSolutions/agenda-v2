const mongoose = require( "mongoose" );
const Schema   = mongoose.Schema;

const meetingSchema = new Schema(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    participants: [ {
      type: Schema.Types.ObjectId,
      ref: "Participant"
    } ],
    date: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model( "Meeting", meetingSchema );
