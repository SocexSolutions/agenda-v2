const ObjectId = require('mongoose').Types.ObjectId;

const meeting = ( opts ) => {
  const randomName = ( Math.random() + 1 ).toString( 36 ).substring( 7 ); //rip faker

  return {
    name: randomName,
    owner_id: new ObjectId,
    date: new Date(),
    ...opts
  };
};

module.exports = meeting;
