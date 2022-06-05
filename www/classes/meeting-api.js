import RestAPI from '../classes/rest-api';
import client from '../api/client';
import { store } from '../store';
import { notify } from '../store/features/snackbar';

/**
 * @typedef {Object} AggregateMeeting
 * @property {Meeting} meeting - meeting object
 * @property {Topic[]} topics - array of meeting's topics
 * @property {Participant[]} participants - array of meeting's participants
 */

class MeetingAPI extends RestAPI {

  /**
   * Create a MeetingAPI Instance
   *
   * @returns {MeetingAPI}
   */
  constructor() {
    super('meeting');
  }

  /**
   * @description Get a meeting's topics
   *
   * @param {String} id - meeting._id to search with
   *
   * @returns {Promise<Topic[]>} - meeting's topics
   */
  async getTopics( id ) {
    try {
      const res = await client.get( `/meeting/${ id }/topics` );

      return res.data;
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to fetch topics for meeting (${ err.message })`,
        type: 'danger'
      }) );
    }
  }

  /**
   * @description Get a meeting's participants
   *
   * @param {String} id - meeting._id to search with
   *
   * @returns {Promise<Participant[]} - meeting's participants
   */
  async getParticipants( id ) {
    try {
      const res = await client.get( `/meeting/${ id }/participants` );

      return res.data;
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to fetch participants for meeting (${ err.message })`,
        type: 'danger'
      }) );
    }
  }

  /**
   * @description Get a meeting and all of its related topics and participants
   *
   * @param {String} id - meeting._id to search with
   *
   * @returns {Promise<AggregateMeeting>} - aggregate response
   */
  async aggregate( id ) {
    try {
      const res = await client.get( `/meeting/${ id }/aggregate` );

      return res.data;
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to fetch meeting (${ err.message })`,
        type: 'danger'
      }) );
    }
  }

  /**
   * @description Create or update a meeting and all of its related participants
   * and topics
   *
   * @param {AggregateMeeting} payload - aggregate meeting payload
   *
   * @returns {Promise<AggregateMeeting>}
   */
  async aggregateSave( payload ) {
    try {
      const res = await client.post( `/meeting/aggregate`, payload );

      return res.data;
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to save meeting (${ err.message })`,
        type: 'danger'
      }) );
    }
  }
}

export default MeetingAPI;
