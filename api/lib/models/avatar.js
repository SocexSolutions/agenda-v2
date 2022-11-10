const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorValidator = (v) => (/^#([0-9a-f]{3}){1,2}$/i).test(v)

const avatarSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      validator: [colorValidator, 'Invalid color'],
      required: true,
    },
    initials: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }
  }
);

module.exports = mongoose.model("Avatar", avatarSchema);
