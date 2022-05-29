const Participant = require('../models/participant');
const Meeting     = require('../models/meeting');

/**
 * Check if a user is a participant or owner of a meeting
 *
 * @param {ObjectId} meeting_id
 * @param {Object} user
 *
 * @typedef {Object} AuthorizationResult
 * @property {Boolean} authorized - user is authorized
 * @property {Meeting} meeting - meeting returned for utility
 *
 * @returns {Promise<AuthorizationResult>}
 */
module.exports = async( meeting_id, user, res ) => {
  const [ participant, meeting ] = await Promise.allSettled([
    Participant.findOne({ meeting_id, email: user.email }),
    Meeting.findOne({ _id: meeting_id })
  ]);

  const is_owner = meeting.status === 'fulfilled' &&
    meeting.value.owner_id.toString() === user._id.toString();

  const is_participant = participant.status === 'fulfilled' &&
    participant.value;

  if ( is_owner || is_participant ) {
    return { authorized: true, meeting: meeting.value };
  }

  return { authorized: false, meeting: {} };
};
