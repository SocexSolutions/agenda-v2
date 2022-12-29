const ObjectID = require("mongoose").Types.ObjectId;

module.exports = () => {
  return {
    color: "hsl(144.61708086985226,77.63562668242602%,91.11721900382429%)",
    user_id: new ObjectID()
  };
};
