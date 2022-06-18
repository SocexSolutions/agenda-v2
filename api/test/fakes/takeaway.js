const ObjectId = require('mongoose').Types.ObjectId;

const takeaway = ( overrides ) => {
  const topic_id   = new ObjectId();
  const owner_id   = new ObjectId();
  const meeting_id = new ObjectId();

  return {
    name: 'we need to do something',
    description: 'we need to do something and we need to do it now',
    reactions: [],
    topic_id: topic_id.toString(),
    owner_id: owner_id.toString(),
    meeting_id: meeting_id.toString(),
    ...overrides
  };
};

module.exports = takeaway;
