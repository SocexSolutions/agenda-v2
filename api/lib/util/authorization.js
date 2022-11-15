const Participant = require("../models/participant");
const Meeting = require("../models/meeting");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
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

      throw new AuthErr("participant not participant");
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

    throw new AuthErr("user not participant");
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

    throw new AuthErr("not owner");
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
    throw new AuthErr("not user");
  }
};
