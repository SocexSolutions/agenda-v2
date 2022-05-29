module.exports = ( overrides ) => {
  return {
    email: 'brian@brian.com',
    username: 'brian',
    hash: 'hash',
    salt: 'salt',
    ...overrides
  };
};
