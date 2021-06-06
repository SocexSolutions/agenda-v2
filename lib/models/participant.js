const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const participantSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        meeting: { type: Schema.Types.ObjectId, ref: "Meeting", required: true },
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("Participant", participantSchema);

