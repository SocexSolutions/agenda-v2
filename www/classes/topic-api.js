import RestAPI from './rest-api';
import client from '../api/client';
import { store } from '../store';
import { notify } from '../store/features/snackbar';

class TopicAPI extends RestAPI {

  /**
   * Create an instance of TopicAPI
   *
   * @returns {TopicAPI}
   */
  constructor() {
    super('topic');
  }

  /**
   * Fetch the takeaways for a given topic
   *
   * @param {String} id - topic id to get takeaways for
   *
   * @returns {Promise<Takeaway[]>} - array of related takeaways
   */
  async getTakeaways( id ) {
    try {
      const res = await client.get( `topic/${ id }/takeaways` );

      return res.data;
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to get takeaways for topic (${ err.message })`,
        type: 'danger'
      }) );

      return [];
    }
  }

  /**
   * Add or remove a like from a topic with the given email
   *
   * @param {String} id - topic id
   *
   * @param {String} email - email of user/participant to like with
   */
  async like( id, email ) {
    try {
      await client.patch( `topic/${ id }/like`, { email } );
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to like topic (${ err.message })`,
        type: 'danger'
      }) );
    }
  }
}

export default TopicAPI;
