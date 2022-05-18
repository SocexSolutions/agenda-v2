const Participant = require('../models/participant');

/**
 * Check if a user is a participant of a meeting. Returns true if a user is a
 * participant, and false if they are not
 * @param {ObjectId} meeting_id
 * @param {boolean} participant_email
 * @returns {Promise<boolean>}
 */
module.exports = async( meeting_id, participant_email ) => {
  const all_participants = await Participant.find({ meeting_id });

  const found = all_participants.filter( participant => {
    return participant.email === participant_email;
  });

  return found.length > 0;
};
