const Invite = require("../models/invite");
const User = require("../models/user");
const authUtils = require("../util/authorization");

module.exports = {
  create: async (req, res) => {
    const { group_id, invitee } = req.body;

    await authUtils.checkOwner(group_id, "groups", req.credentials);

    const inviteeUser = await User.findOne({ _id: invitee });

    if (!inviteeUser) {
      return res.status(400).send({ message: "Invitee not found" });
    }

    const existingInvite = await Invite.findOne({
      group_id,
      invitee,
      status: "open",
    });

    if (existingInvite) {
      return res.status(400).send({ message: "User already invited" });
    }

    const group = await Invite.create({
      owner_id: req.credentials.user._id,
      invitee,
      status: "open",
    });

    res.status(201).send(group);
  },
};
