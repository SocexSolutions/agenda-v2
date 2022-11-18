let count = 0;

module.exports = (overrides) => {
  count += 1;

  return {
    email: `user${count}@test.com`,
    username: `user${count}`,
    password: `pass${count}`,
    ...overrides,
  };
};
