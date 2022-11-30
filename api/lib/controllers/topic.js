const Topic = require("../models/topic");
const Takeaway = require("../models/takeaway");
const ActionItem = require("../models/action-item");
const authUtils = require("../util/authorization");

module.exports = {
  create: async (req, res) => {
    const new_topic = req.body;

    await authUtils.checkParticipant(new_topic.meeting_id, req.credentials);

    const topic = await Topic.create({
      ...new_topic,
      owner_id: req.credentials.sub,
    });

    return res.status(201).send(topic);
  },

  update: async (req, res) => {
    const updates = req.body;
    const { _id } = req.params;

    const sub_id = req.credentials.sub;

    await authUtils.checkOwner(_id, "topics", req.credentials);

    const topic_updated = await Topic.findOneAndUpdate(
      { _id },
      { ...updates, owner_id: sub_id },
      { new: true }
    );

    res.status(200).send(topic_updated);
  },

  delete: async (req, res) => {
    const { _id } = req.params;

    await authUtils.checkOwner(_id, "topics", req.credentials);

    await Topic.deleteOne({ _id });

    return res.status(204).send();
  },

  like: async (req, res) => {
    const { _id } = req.params;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant(topic.meeting_id, req.credentials);

    const email = req.credentials.user.email;

    if (!topic.likes.includes(email)) {
      const meetingTopics = await Topic.find({
        meeting_id: topic.meeting_id,
      });

      const likedTopics = meetingTopics.filter((topic) =>
        topic.likes.includes(email)
      );

      if (likedTopics.length > Math.floor(meetingTopics.length / 2)) {
        return res.status(400).send("Too many likes.");
      }

      topic.likes.push(email);
    } else {
      topic.likes = topic.likes.filter((e) => {
        return e !== email;
      });
    }

    const updated = await Topic.findOneAndUpdate(
      { _id },
      { likes: topic.likes },
      { new: true }
    );

    return res.status(200).send(updated);
  },

  close: async (req, res) => {
    const { _id } = req.params;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant(topic.meeting_id, req.credentials);

    if (topic.status === "closed") {
      return res.status(400).send("Topic is already closed");
    }

    const updated = await Topic.findOneAndUpdate(
      { _id },
      { status: "closed" },
      { new: true }
    );

    return res.status(200).send(updated);
  },

  reOpen: async (req, res) => {
    const { _id } = req.params;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant(topic.meeting_id, req.credentials);

    if (topic.status === "open") {
      return res.status(400).send("Topic is already open");
    }

    const updated = await Topic.findOneAndUpdate(
      { _id },
      { status: "open" },
      { new: true }
    );

    return res.status(200).send(updated);
  },

  getTakeaways: async (req, res) => {
    const { _id } = req.params;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant(topic.meeting_id, req.credentials);

    const takeaways = await Takeaway.find({ topic_id: _id });

    res.status(200).send(takeaways);
  },

  getActionItems: async (req, res) => {
    const { _id } = req.params;

    const topic = await Topic.findOne({ _id });

    await authUtils.checkParticipant(topic.meeting_id, req.credentials);

    const actionItems = await ActionItem.find({ topic_id: _id });

    res.status(200).send(actionItems);
  },
};
