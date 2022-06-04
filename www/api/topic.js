import RestAPI from '../classes/rest-api';
import client from '../store/client';
import { notify } from '../store/features/snackbar/snackbarSlice';
import { store } from '../store/store';

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
      message: 'Failed to get takeaways for topic',
      type: 'danger'
    }) );

    return [];
  }
}

export default new RestAPI(
  'topic',
  { additionalMethods: { getTakeaways } }
);
