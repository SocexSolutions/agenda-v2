const Participant = require('../models/participant');

/**
 * Check if a user is a participant of a meeting. Returns true if a user is a
 * participant, and false if they are not
 * @param {ObjectId} meeting_id
 * @param {boolean} email
 * @returns {Promise<boolean>}
 */
module.exports = async( meeting_id, email ) => {
  const found = await Participant.findOne({ meeting_id, email });

  return !!found;
};
