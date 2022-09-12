const ObjectId = require('mongoose').Types.ObjectId;
const  faker   = require('@faker-js/faker').faker;

const meeting = ( opts ) => {

  return {
    name: faker.name.firstName(),
    owner_id: new ObjectId,
    date: new Date(),
    ...opts
  };
};

module.exports = meeting;
