const ObjectId = require('mongoose').Types.ObjectId;

const actionItem = ( opts ) => {
  const topic_id   = new ObjectId();
  const owner_id   = new ObjectId();
  const meeting_id = new ObjectId();

  return {
    name: 'Do something',
    description: 'we need to do something and we need to do it now',
    topic_id: topic_id.toString(),
    owner_id: owner_id.toString(),
    meeting_id: meeting_id.toString(),
    completed: false,
    ...opts
  };
};

module.exports = actionItem;
