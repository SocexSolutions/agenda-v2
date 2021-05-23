const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    participantNames: [String],
    participantEmails: [String],
    participantIds: [Number],
    ownerId: Number,
    ownerEmail: String,
    topics: [String],
    dateOf: String,
    time: String,
  },
  {
    timestamps: { createdAt: "created_at" }, //not sure if we need this or not
  }
);
