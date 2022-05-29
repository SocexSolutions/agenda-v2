const Participant = require('../models/participant');
const Meeting     = require('../models/meeting');
const mongoose    = require('mongoose');

/**
 * Check if a user or participant is a participant or owner of a meeting
 *
 * @param {ObjectId} meeting_id
 * @param {Object} credentials
 *
 * @typedef {Object} ParticipantCheckResult
 * @property {Boolean} authorized - user is authorized
 * @property {Meeting} [meeting] - meeting returned for utility
 *
 * @returns {Promise<ParticipantCheckResult>}
 */
module.exports.check_participant = async( meeting_id, credentials ) => {
  const { user, participant } = credentials;

  if ( participant ) {
    if ( participant.meeting_id.toString() === meeting_id.toString() ) {
      const meeting = await Meeting.findOne({ _id: meeting_id });
      return { authorized: true, meeting };
    }

    return { authorized: false };
  }

  const [ participant_res, meeting_res ] = await Promise.allSettled([
    Participant.findOne({ meeting_id, email: user.email }),
    Meeting.findOne({ _id: meeting_id })
  ]);

  const is_owner = meeting_res.status === 'fulfilled' &&
    meeting_res.value.owner_id.toString() === user._id.toString();

  const is_participant = participant_res.status === 'fulfilled' &&
    participant_res.value;

  if ( is_owner || is_participant ) {
    return { authorized: true, meeting: meeting_res.value };
  }

  return { authorized: false };
};

/**
 * Check if a user or participant is the owner of a document by comparing the
 * owner_id with the subject id
 *
 * @param {ObjectId} _id - id of item to check
 * @param {String} collection_name - collection of item to check
 * @param {Object} credentials - req.credentials
 *
 * @typedef {Object} OwnerCheckResult
 * @property {Boolean} authorized - user or participant is authorized
 * @property {Meeting} [document] - document owned by user returned for utility
 *
 * @returns {Promise<OwnerCheckResult>}
 */
module.exports.check_owner = async( _id, collection_name, credentials ) => {
  const { user, participant } = credentials;

  const subject_id = user?._id || participant._id;

  const collection = mongoose.connection.collection( collection_name );

  const document = await collection.findOne({ _id });

  if ( document.owner_id.toString() === subject_id.toString() ) {
    return { authorized: true, document };
  }

  return { authorized: false };
};

/**
 * Check if a subject is a user
 *
 * @param credentials - req.credentials
 *
 * @returns {<UserCheckResult>}
 */
module.exports.check_user = ( credentials ) => {
  return { authorized: !!credentials?.usr };
};
