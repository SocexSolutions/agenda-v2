const ObjectId = require('mongoose').Types.ObjectId;

const topic = ( opts ) => {
  return {
    name: 'some topic name',
    description: 'some topic description',
    meeting_id: new ObjectId,
    owner_id: new ObjectId,
    likes: [ 'bryan@bacon.com' ],
    status: 'open',
    ...opts
  };
};

module.exports = topic;
