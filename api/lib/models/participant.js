const mongoose = require( "mongoose" );
const Schema = mongoose.Schema;

const participantSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    meeting_id: {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model( "Participant", participantSchema );
