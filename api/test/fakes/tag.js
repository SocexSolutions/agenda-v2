const mongoose = require("mongoose");

module.exports = (overrides) => {
  return {
    group_id: new mongoose.Types.ObjectId(),
    name: "Test Tag",
    color: "red",
    ...overrides,
  };
};
