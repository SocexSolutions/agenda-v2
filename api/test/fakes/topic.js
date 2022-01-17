const faker    = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;

const topic = ( opts ) => {
  return {
    name: faker.commerce.productName(),
    meeting_id: new ObjectId,
    likes: [ new ObjectId, new ObjectId ],
    ...opts
  };
};

module.exports = topic;
