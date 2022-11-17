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

  cancel: async (req, res) => {
    const { _id } = req.params;

    const invite = await Invite.findOne({ _id });

    if (!invite) {
      return res.status(404).send({ message: "Invite not found" });
    }

    if (invite.owner_id.toString() !== req.credentials.user._id.toString()) {
      return res.status(403).send({ message: "Unauthorized" });
    }

    if (invite.status !== "open") {
      if (invite.status === "cancelled") {
        return res
          .status(400)
          .send({ message: "Invite was already cancelled" });
      }

      return res
        .status(400)
        .send({ message: "Invite was already responded to" });
    }

    const updated = await Invite.findOneAndUpdate(
      { _id },
      { status: "cancelled" },
      { new: true }
    );

    res.status(200).send(updated);
  },

  respond: async (req, res) => {
    const { _id } = req.params;
    const { status } = req.body;

    const invite = await Invite.findOne({ _id });

    if (!invite) {
      return res.status(404).send({ message: "Invite not found" });
    }

    if (invite.invitee.toString() !== req.credentials.user._id.toString()) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    if (invite.status !== "open") {
      if (invite.status === "cancelled") {
        return res.status(400).send({ message: "Invite was cancelled" });
      }

      // Don't allow users to later accept stale invites in order to gain access
      // to a group
      return res
        .status(400)
        .send({ message: "Invite was already responded to" });
    }

    const updated = await Invite.findOneAndUpdate(
      { _id },
      { status },
      { new: true }
    );

    if (status === "accepted") {
      await User.findOneAndUpdate(
        { _id: req.credentials.user._id },
        { $push: { groups: invite.group_id } }
      );
    }

    res.status(200).send(updated);
  },
};
