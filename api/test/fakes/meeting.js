const ObjectId = require("mongoose").Types.ObjectId;

const meeting = (opts) => {
  return {
    name: "meeting about something",
    owner_id: new ObjectId(),
    date: new Date(),
    purpose: "to discuss something",
    status: "draft",
    ...opts,
  };
};

module.exports = meeting;
