const ObjectID = require("mongoose").Types.ObjectId;

module.exports = (overrides) => {
  return {
    name: "test group",
    owner_ids: [new ObjectID()],
    parent_groups: [],
    child_groups: [],
    ...overrides,
  };
};
