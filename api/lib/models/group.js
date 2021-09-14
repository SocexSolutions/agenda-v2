const mongoose = require( "mongoose" );
const Schema   = mongoose.Schema;

const groupSchema = new Schema(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [ {
      type: Schema.Types.ObjectId,
      ref: "User"
    } ],
  }
);

module.exports = mongoose.model( "Group", groupSchema );
