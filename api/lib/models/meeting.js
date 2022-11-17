const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: -1,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "live", "completed"],
      default: "draft",
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: "Tag",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);
