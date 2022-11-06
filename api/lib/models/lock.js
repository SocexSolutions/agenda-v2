const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lockSchema = new Schema({
  key: {
    type: String,
    required: true,
    index: true,
  },
  expires: {
    type: Date,
    required: true,
    index: true,
  },
});

module.exports = mongoose.model("Lock", lockSchema);
