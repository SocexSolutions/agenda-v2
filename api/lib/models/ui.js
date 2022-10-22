const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uiSchema = new mongoose.Schema({
  theme: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Ui", uiSchema);
