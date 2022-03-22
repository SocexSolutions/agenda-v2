const ObjectID = require('mongoose').Types.ObjectId;

module.exports = ( user_id ) => {
  return {
    theme:   'default',
    user_id: new ObjectID
  };
};
