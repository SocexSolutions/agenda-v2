const Participant = require("../models/participant");
const Meeting = require("../models/meeting");
const Group = require("../models/group");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const AuthErr = require("../classes/auth-err");
const jobi = require("@starryinternet/jobi");

/**
 * Check if a user or participant is a participant or owner of a meeting
 *
 * @param {ObjectId} meeting_id
 * @param {Object} credentials
 *
 * @returns {Promise<Meeting>}
 */
module.exports.checkParticipant = async (meeting_id, credentials) => {
  try {
    jobi.debug("checkParticipant creds:", credentials);

    const { user, participant } = credentials;

    if (participant) {
      if (participant.meeting_id.toString() === meeting_id.toString()) {
        const meeting = await Meeting.findOne({ _id: meeting_id });
        return meeting;
      }

      throw new AuthErr(
        "You must be a participant or owner of the meeting to do that"
      );
    }

    const [participant_res, meeting_res] = await Promise.allSettled([
      Participant.findOne({ meeting_id, email: user.email }),
      Meeting.findOne({ _id: meeting_id }),
    ]);

    const is_owner =
      meeting_res.status === "fulfilled" &&
      meeting_res.value.owner_id.toString() === user._id.toString();

    const is_participant =
      participant_res.status === "fulfilled" && participant_res.value;

    if (is_owner || is_participant) {
      return meeting_res.value;
    }

    throw new AuthErr(
      "You must be a participant or owner of the meeting to do that"
    );
  } catch (err) {
    if (err instanceof AuthErr) {
      throw err;
    }

    /* istanbul ignore next */
    throw new AuthErr(err.message);
  }
};

/**
 * Check if a user or participant is the owner of a document by comparing the
 * owner_id with the subject id, throws if not
 *
 * @param {ObjectId|String} _id - id of item to check
 * @param {String} collection_name - collection of item to check
 * @param {Object} credentials - req.credentials
 *
 * @returns {Promise<document>}
 */
module.exports.checkOwner = async (_id, collection_name, credentials) => {
  try {
    jobi.info("checkOwner creds: ", credentials);

    const { user, participant } = credentials;

    const subject_id = user?._id || participant._id;

    const collection = mongoose.connection.collection(collection_name);

    const id = _id instanceof ObjectId ? _id : new ObjectId(_id);

    const document = await collection.findOne({ _id: id });

    if (
      document.owner_id &&
      document.owner_id.toString() === subject_id.toString()
    ) {
      return document;
    }

    if (document.owner_ids) {
      const isOwner = document.owner_ids.some(
        (owner_id) => owner_id.toString() === subject_id.toString()
      );

      if (isOwner) {
        return document;
      }
    }

    throw new AuthErr("You need to own the document to do that");
  } catch (err) {
    if (err instanceof AuthErr) {
      throw err;
    }

    /* istanbul ignore next */
    throw new AuthErr(err.message);
  }
};

/**
 * Check if a subject is a user, throws if not
 *
 * @param credentials - req.credentials
 */
module.exports.checkUser = async (credentials) => {
  jobi.debug("checkUser creds:", credentials);

  if (!credentials?.usr) {
    throw new AuthErr("You must be a user to do that");
  }
};

/**
 * Check if a subject is a member of a group, throws if not
 *
 * @param {ObjectId} group_id
 * @param {Object} credentials
 *
 * @returns {Promise<Group>}
 */
module.exports.checkGroupMember = async (group_id, credentials) => {
  try {
    jobi.debug("checkGroupMember creds:", credentials);

    const { user } = credentials;

    if (!user) {
      throw new AuthErr(
        "You must be a user and group member or owner to do that"
      );
    }

    const isMember = user.groups.some((g) => {
      return g.toString() === group_id.toString();
    });

    const group = await Group.findOne({ _id: group_id });

    const isOwner = group.owner_ids.some((owner_id) => {
      return owner_id.toString() === user._id.toString();
    });

    if (!isMember && !isOwner) {
      throw new AuthErr("You must be a group member or owner to do that");
    }

    return group;
  } catch (err) {
    if (err instanceof AuthErr) {
      throw err;
    }

    /* istanbul ignore next */
    throw new Error(err.message);
  }
};
