const mongoose = require("mongoose");

const resetRequest = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    }
  },
);

module.exports = mongoose.model("ResetRequest", resetRequest);
