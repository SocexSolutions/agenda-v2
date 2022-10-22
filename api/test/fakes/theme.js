const ObjectID = require("mongoose").Types.ObjectId;

module.exports = () => {
  return {
    theme: "default",
    user_id: new ObjectID(),
  };
};
