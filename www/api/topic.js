import RestAPI from '../classes/rest-api';
import client from './client';
import { notify } from '../store/features/snackbar';
import { store } from '../store';

/**
 * Fetch the takeaways for a given topic
 * @param {String} id - topic id to get takeaways for
 * @returns {Promise<Takeaway[]>} - array of related takeaways
 */
async function getTakeaways( id ) {
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
 * @param {String} id - topic id
 * @param {String} email - email of user/participant to like with
 */
async function like( id, email ) {
  try {
    await client.patch( `topic/${ id }/like`, { email } );
  } catch ( err ) {
    store().dispatch( notify({
      message: `Failed to like topic (${ err.message })`,
      type: 'danger'
    }) );
  }
}

export default new RestAPI(
  'topic',
  { additionalMethods: { getTakeaways, like } }
);
