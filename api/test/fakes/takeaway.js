const faker    = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;

const takeaway = ( overrides ) => {
  const topic_id = new ObjectId();
  const owner_id = new ObjectId();

  return {
    content: faker.random.words( Math.floor( Math.random() * 20 ) ),
    reactions: [],
    topic_id: topic_id.toString(),
    owner_id: owner_id.toString(),
    ...overrides
  };
};

module.exports = takeaway;
