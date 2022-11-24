const mongoose = require("mongoose");
const Meeting = require("../models/meeting");
const Topic = require("../models/topic.js");
const Participant = require("../models/participant");
const ActionItem = require("../models/action-item");
const Takeaway = require("../models/takeaway");
const User = require("../models/user");
const ObjectID = require("mongoose").Types.ObjectId;
const authUtils = require("../util/authorization");

module.exports = {
  /**
   * Get a meeting
   * @param {String} req.params._id - meeting id
   */
  get: async (req, res) => {
    const { _id } = req.params;

    const meeting = await authUtils.checkParticipant(_id, req.credentials);

    res.status(200).send(meeting);
  },

  /**
   * Create a new meeting
   * @param {String} req.body.name - meeting name
   * @param {Date}   req.body.date - meeting date
   */
  create: async (req, res) => {
    const { name, date } = req.body;

    await authUtils.checkUser(req.credentials);

    const meeting = await Meeting.create({
      name,
      date,
      owner_id: req.credentials.sub,
    });

    res.status(200).send(meeting);
  },

  /**
   * Update an existing meeting
   * @param {String} req.body.name  - meeting name
   * @param {Date}   req.body.date  - meeting date
   * @param {String} req.params._id - meeting id
   */
  update: async (req, res) => {
    const { name, date } = req.body;
    const _id = req.params._id;

    await authUtils.checkOwner(_id, "meetings", req.credentials);

    const updated = await Meeting.findOneAndUpdate(
      { _id },
      { name, date },
      { new: true }
    );

    res.status(200).send(updated);
  },

  /**
   * Get all related meeting data (topics, participants)
   * @param {string} req.params._id - meeting _id
   */
  aggregate: async (req, res) => {
    const { _id } = req.params;

    await authUtils.checkParticipant(_id, req.credentials);

    const [queryResult] = await Meeting.aggregate([
      {
        $match: {
          _id: new ObjectID(_id),
        },
      },
      {
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "meeting_id",
          as: "participants",
        },
      },
      {
        $lookup: {
          from: "topics",
          localField: "_id",
          foreignField: "meeting_id",
          pipeline: [
            {
              $lookup: {
                from: "actionitems",
                localField: "_id",
                foreignField: "topic_id",
                as: "actionItems",
              },
            },
            {
              $lookup: {
                from: "takeaways",
                localField: "_id",
                foreignField: "topic_id",
                as: "takeaways",
              },
            },
          ],
          as: "topics",
        },
      },
    ]);

    const { _id: agg_id, name, date, owner_id } = queryResult;

    return res.status(200).send({
      meeting: { _id: agg_id, name, date, owner_id },
      participants: queryResult.participants,
      topics: queryResult.topics,
    });
  },

  /**
   * Create or update a meeting and all its data
   * @param {Meeting} req.body.meeting - meeting
   * @param {Topic[]} req.body.topics - array of Topics
   * @param {Participant[]} req.body.participants - array of Participants
   *
   * @deprecated
   */
  aggregateSave: async (req, res) => {
    let session;

    try {
      const { name, date, owner_id } = req.body.meeting;

      const meeting_id = req.body.meeting?._id || new ObjectID();
      const subject_id = req.credentials.sub;

      let topics = req.body.topics || null;
      let participants = req.body.participants || null;

      let meeting = await Meeting.findOne({ _id: meeting_id });

      if (meeting && meeting.owner_id.toString() !== subject_id) {
        return res.status(403).send("unauthorized");
      }

      session = await mongoose.connection.startSession();

      await session.withTransaction(async () => {
        meeting = await Meeting.findOneAndUpdate(
          { _id: meeting_id },
          { name, owner_id, date },
          {
            upsert: true,
            new: true,
          }
        );

        if (topics) {
          topics = await Topic.saveMeetingTopics({
            meeting_id: meeting._id,
            savedTopics: topics,
            subject_id,
          });
        } else {
          await Topic.deleteMany({ meeting_id: meeting._id });

          topics = [];
        }

        await Participant.deleteMany({ meeting_id: meeting._id });

        if (participants) {
          const formattedParticipants = participants.map((participant) => {
            return {
              email: participant.email,
              meeting_id: meeting._id,
            };
          });

          await Participant.insertMany(formattedParticipants);
        }

        participants = await Participant.find({ meeting_id: meeting._id });
      });

      res.status(201).send({
        meeting,
        topics,
        participants,
      });
    } finally {
      session.endSession();
    }
  },

  async getTopics(req, res) {
    const { _id } = req.params;

    await authUtils.checkParticipant(_id, req.credentials);

    const topics = await Topic.find({ meeting_id: _id });

    return res.status(200).send(topics);
  },

  async getParticipants(req, res) {
    const { _id } = req.params;

    await authUtils.checkParticipant(_id, req.credentials);

    const [{ participants }] = await Meeting.aggregate([
      { $match: { _id: new ObjectID(_id) } },
      {
        $lookup: {
          from: "participants",
          localField: "_id",
          foreignField: "meeting_id",
          as: "participants",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                email: 1,
                username: 1,
                meeting_id: new ObjectID(_id),
              },
            },
          ],
          as: "owner",
        },
      },
      {
        $project: {
          participants: { $concatArrays: ["$participants", "$owner"] },
        },
      },
    ]);

    return res.status(200).send(participants);
  },

  /**
   * Get a meeting's related action items. This route requires that the user
   * is a participant of the meeting.
   * @param {string} _id - meeting id to search for
   */
  async getActionItems(req, res) {
    const { _id } = req.params;

    await authUtils.checkParticipant(_id, req.credentials);

    const actionItems = await ActionItem.find({ meeting_id: _id });

    return res.status(200).send(actionItems);
  },

  /**
   * Get a meeting's related takeaways. This route requires that the user
   * is a participant of the meeting.
   * @param {string} _id - meeting id to search for
   */
  async getTakeaways(req, res) {
    const { _id } = req.params;

    await authUtils.checkParticipant(_id, req.credentials);

    const takeaways = await Takeaway.find({ meeting_id: _id });

    return res.status(200).send(takeaways);
  },

  /**
   * Change a meeting's status potentially triggering lifecycle events
   * @param {string} req.body.status - new status
   * @param {Object} req.params._id - meeting id
   */
  async updateStatus(req, res) {
    const {
      params: { _id },
      body: { status },
    } = req;

    await authUtils.checkOwner(_id, "meetings", req.credentials);

    const meeting = await Meeting.findOneAndUpdate(
      { _id },
      { status },
      { new: true }
    );

    // TODO send notification to participants when status changes from
    // draft to sent.

    return res.status(200).send(meeting);
  },

  async index(req, res) {
    const subject_email = req.credentials.user.email;
    const subject_id = req.credentials.sub;
    const { limit = 10, skip = 0, name = "", owners = [] } = req.query;

    const pipelineFilters = [];
    const filtered = !!name || !!owners.length;

    const ownerLookup = [
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                email: 1,
                username: 1,
              },
            },
          ],
          as: "owner",
        },
      },
      {
        $project: {
          name: 1,
          owner: { $arrayElemAt: ["$owner", 0] },
          date: 1,
          status: 1,
        },
      },
    ];

    owners.length &&
      pipelineFilters.push({
        $match: {
          owner_id: {
            $in: owners.map((owner) => ObjectID(owner)),
          },
        },
      });

    name &&
      pipelineFilters.push({
        $match: { name: { $regex: name, $options: "i" } },
      });

    const sliceStart = parseInt(skip);
    const sliceEnd = parseInt(limit);

    const pipeline = [
      {
        $match: { _id: ObjectID(subject_id) },
      },
      {
        $lookup: {
          from: "meetings",
          localField: "_id",
          foreignField: "owner_id",
          pipeline: [...pipelineFilters, ...ownerLookup],
          as: "owned_meetings",
        },
      },
      {
        $lookup: {
          from: "participants",
          pipeline: [
            { $match: { email: subject_email } },
            {
              $lookup: {
                from: "meetings",
                localField: "meeting_id",
                foreignField: "_id",
                pipeline: [
                  ...pipelineFilters,
                  ...ownerLookup,
                  {
                    $match: { status: { $ne: "draft" } },
                  },
                ],
                as: "meetings",
              },
            },
            {
              $project: {
                meeting: {
                  $arrayElemAt: ["$meetings", 0],
                },
              },
            },
            { $unwind: "$meeting" },
            {
              $replaceRoot: {
                newRoot: "$meeting",
              },
            },
          ],
          as: "participating_meetings",
        },
      },
      {
        $project: {
          meetings: {
            $concatArrays: ["$participating_meetings", "$owned_meetings"],
          },
        },
      },
      {
        $project: {
          meetings: {
            $sortArray: {
              input: "$meetings",
              sortBy: { date: -1 },
            },
          },
          count: { $size: "$meetings" },
          owners: "$meetings.owner",
        },
      },
      {
        $project: {
          meetings: {
            $slice: ["$meetings", sliceStart, sliceEnd],
          },
          count: 1,
          owners: 1,
        },
      },
    ];

    const [{ meetings, count, owners: allOwners }] = await User.aggregate(
      pipeline
    );

    const reducedOwners = Object.values(
      allOwners.reduce((prev, owner) => {
        prev[owner._id] = owner;

        return prev;
      }, {})
    );

    return res
      .status(200)
      .send({ meetings, count, owners: reducedOwners, filtered });
  },

  /**
   * Delete a meeting and all related data to it
   * @param {string} req.params._id - _id of meeting to delete
   */
  async delete(req, res) {
    const meeting_id = req.params._id;

    await authUtils.checkOwner(meeting_id, "meetings", req.credentials);

    let session;

    try {
      session = await mongoose.connection.startSession();

      await session.withTransaction(async () => {
        await Promise.all([
          Meeting.deleteOne({ _id: meeting_id }),
          Participant.deleteMany({ meeting_id }),
          Topic.deleteMany({ meeting_id }),
          Takeaway.deleteMany({ meeting_id }),
          ActionItem.deleteMany({ meeting_id }),
        ]);
      });

      res.status(204).send();
    } finally {
      session.endSession();
    }
  },

  async addTag(req, res) {
    const { _id, tag_id } = req.params;

    await authUtils.checkOwner(_id, "meetings", req.credentials);

    const meeting = await Meeting.findOneAndUpdate(
      { _id },
      { $addToSet: { tags: tag_id } },
      { new: true }
    );

    return res.status(200).send(meeting);
  },

  async removeTag(req, res) {
    const { _id, tag_id } = req.params;

    await authUtils.checkOwner(_id, "meetings", req.credentials);

    const meeting = await Meeting.findOneAndUpdate(
      { _id },
      { $pull: { tags: tag_id } },
      { new: true }
    );

    return res.status(200).send(meeting);
  },
};
