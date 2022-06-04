import RestAPI from '../classes/rest-api';

/**
 * Fetch the takeaways for a given topic, relies on the existence of
 * `client`, `store`, and `notify` in its context

 * @param {String} id - topic id to get takeaways for

 * @returns {Promise<Takeaway[]>} - array of related takeaways
 */
async function getTakeaways( id ) {
  try {
    const res = await this.client.get( `topic/${ id }/takeaways` );

    return res;
  } catch ( err ) {
    this.store.dispatch( this.notify({
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
