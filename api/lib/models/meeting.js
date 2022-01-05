const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const meetingSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model( 'Meeting', meetingSchema );
