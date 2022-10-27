const ActionItem = require("../models/action-item");
const authUtils = require("../util/authorization");

module.exports = {
  create: async (req, res) => {
    const { name, description, topic_id, meeting_id, assigned_to } = req.body;

    await authUtils.checkParticipant(meeting_id, req.credentials);

    const actionItem = await ActionItem.create({
      name,
      description,
      topic_id,
      meeting_id,
      owner_id: req.credentials.sub,
      ...{ assigned_to },
    });

    res.status(201).send(actionItem);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { name, description, completed } = req.body;
    const subject_id = req.credentials.sub;

    const { meeting_id } = await ActionItem.findById(id);

    await authUtils.checkParticipant(meeting_id, req.credentials);

    const updatedActionItem = await ActionItem.findOneAndUpdate(
      { _id: id },
      { name, owner_id: subject_id, description, completed },
      { new: true }
    );

    res.status(200).send(updatedActionItem);
  },

  delete: async (req, res) => {
    const { id } = req.params;

    const { meeting_id } = await ActionItem.findById(id);

    await authUtils.checkParticipant(meeting_id, req.credentials);

    const deleted = await ActionItem.deleteOne({
      _id: id,
    });

    res.status(204).send(deleted);
  },
};
