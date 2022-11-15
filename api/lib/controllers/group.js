const Group = require("../models/group");
const authUtils = require("../util/authorization");

module.exports = {
  create: async (req, res) => {
    const { name } = req.body;

    const group = await Group.create({
      name,
      owner_ids: [req.credentials.user._id],
    });

    res.status(201).send(group);
  },

  update: async (req, res) => {
    const { _id } = req.params;
    const { name } = req.body;

    await authUtils.checkOwner(_id, "groups", req.credentials);

    const group = await Group.findOneAndUpdate(
      { _id },
      { name },
      { new: true }
    );

    res.status(200).send(group);
  },
};
