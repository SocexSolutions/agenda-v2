
const faker    = require('faker');
const ObjectId = require('mongoose').Types.ObjectId;

const meeting = ( opts ) => {
  return {
    name: faker.company.bs(),
    owner_id: new ObjectId,
    date: new Date(),
    ...opts
  };
};

module.exports = meeting;
