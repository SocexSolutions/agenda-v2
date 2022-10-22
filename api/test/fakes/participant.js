const ObjectId = require("mongoose").Types.ObjectId;

const participant = (opts) => {
  return {
    email: "thudson@socnet.com",
    meeting_id: new ObjectId(),
    ...opts,
  };
};

module.exports = participant;
