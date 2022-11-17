const Tag = require("../models/tag");
const authUtils = require("../util/authorization");

module.exports = {
  create: async (req, res) => {
    const { name, color, group_id } = req.body;

    await authUtils.checkGroupMember(group_id, req.credentials);

    const existingTag = await Tag.findOne({ name, group_id });

    if (existingTag) {
      return res.status(400).send("Tag already exists with provided name");
    }

    const tag = await Tag.create({ group_id, name, color });

    res.status(201).send(tag);
  },
};
