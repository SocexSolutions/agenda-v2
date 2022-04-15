const faker    = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;

const topic = ( opts ) => {
  return {
    name: faker.commerce.productName(),
    meeting_id: new ObjectId,
    likes: [ 'bryan@bacon.com' ],
    status: 'open',
    ...opts
  };
};

module.exports = topic;
