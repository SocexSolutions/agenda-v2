const mongoose = require("mongoose");
const Meeting = require("../models/meeting");
const Topic = require("../models/topic.js");
const Participant = require("../models/participant");
const ActionItem = require("../models/action-item");
const Takeaway = require("../models/takeaway");
const User = require("../models/user");
const ObjectID = require("mongoose").Types.ObjectId;
const jobi = require("@starryinternet/jobi");
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
    } catch (error) {
      jobi.error(error.message);

      res.status(500).send(error.message);
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

    const participants = await Participant.find({ meeting_id: _id });

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
    const {  filters } = req.query; // Thanks tom
    const { limit = 0, skip = 0 } = req.query; //will need to change these for total count

    const { owners, name } = JSON.parse( filters );

    const pipelineFilters = [];

    owners.length && pipelineFilters.push({
      $match:  {
        owner_id: {
          $in: owners.map( ( owner ) => ObjectID( owner ) )
        }
      }
    });

    name && pipelineFilters.push({
      $match: { name: { $regex: name, $options: 'i' } }
    });

    try {
      const pipeline = [
        {
          $match: { _id: ObjectID(subject_id) },
        },
        {
          $lookup: {
            from: "meetings",
            localField: "_id",
            foreignField: "owner_id",
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
                  as: "meetings",
                },
              },
              {
                $project: {
                  meeting: { $arrayElemAt: ["$meetings", 0] },
                },
              },
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
<<<<<<< HEAD
        { $unwind: "$meetings" },
        { $replaceRoot: { newRoot: "$meetings" } },
        { $sort: { date: -1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ];

      const meetings = await User.aggregate(pipeline);

      return res.status(200).send(meetings);
    } catch (err) {
      return res.status(500).send(err);
=======
        { $unwind: '$meetings' },
        { $replaceRoot: { newRoot: '$meetings' } },
        ...pipelineFilters,
        { $sort: { 'date': -1 } },
        { $skip: parseInt( skip ) },
        { $limit: parseInt( limit ) }
      ];

      const totalCount = [ //this is more performant than $facet
        {
          $match: { _id: ObjectID( subject_id ) }
        },
        {
          $lookup: {
            from: 'meetings',
            localField: '_id',
            foreignField: 'owner_id',
            as: 'owned_meetings'
          }
        },
        {
          $lookup: {
            from: 'participants',
            pipeline: [
              { $match: { email: subject_email } },
              {
                $lookup: {
                  from: 'meetings',
                  localField: 'meeting_id',
                  foreignField: '_id',
                  as: 'meetings'
                }
              },
              {
                $project: {
                  meeting: { $arrayElemAt: [ '$meetings', 0 ] }
                }
              },
              {
                $replaceRoot: {
                  newRoot: '$meeting'
                }
              }
            ],
            as: 'participating_meetings'
          }
        },
        {
          $project: {
            meetings: {
              $concatArrays: [ '$participating_meetings', '$owned_meetings' ]
            }
          }
        },
        { $unwind: '$meetings' },
        { $replaceRoot: { newRoot: '$meetings' } },
        ...pipelineFilters,
        {
          $count: 'count'
        }
      ];

      const meetings = await User.aggregate( pipeline );
      const count = await User.aggregate( totalCount );

      return res.status( 200 ).send({ meetings, count: count[ 0 ].count }); //idk man 🤮
    } catch ( err ) {
      return res.status( 500 ).send( err );
>>>>>>> 3b83c49 (finished filters and added pagination)
    }
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
    } catch (err) {
      jobi.error(err.message);

      res.status(500).send("Failed to delete meeting.");
    } finally {
      session.endSession();
    }
  },
};
