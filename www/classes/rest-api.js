import client from '../store/client';
import { store } from '../store/store';
import { notify } from '../store/features/snackbar/snackbarSlice';

class RestAPI {

  /**
   * Create an instance of the RestAPI which includes crud operational methods
   * for a given type/controller. By default there are `get`, `create`,
   * `update`, and `destroy`. Others can be included in the constructor.
   *
   * @param {Object} type - rest type (e.g. takeaway, meeting, topic)
   * @param {Object} [opts] - options
   * @property {Object} methods - custom methods to add to the RestAPI which
   * have access to `client`, `store`, and `notify`
   *
   * @returns {RestAPI}
   */
  constructor( type, opts = {} ) {
    this.type = type;

    if ( opts.additionalMethods ) {
      for ( const methodName of Object.keys( opts.additionalMethods ) ) {
        this[ methodName ] = opts.additionalMethods[ methodName ].bind( this );
      }
    }
  }

  /**
   * Get a specific object by id (handles errors with notification)
   * @param {String} id - id of object to retrieve
   * @returns {Promise<Object|undefined>} - retrieved object
   */
  async get( id ) {
    try {
      const res = await client.get( `${ this.type }/${ id }` );

      return res.data;
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to get ${ this.type } (${ err.message } )`,
        type: 'danger'
      }) );
    }
  }

  /**
   * Create a object (handles errors with notifications)
   * @param {Object} payload - object to create
   * @returns {Promise<Object|undefined>} - created object
   */
  async create( payload ) {
    try {
      const res = await client.post( this.type, payload );

      return res.data;
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to create ${ this.type } (${ err.message } )`,
        type: 'danger'
      }) );
    }
  }

  /**
   * Update an object (handles errors with notifications)
   * @param {String} id - id of object to update
   * @param {Object} payload  - updates to object
   * @returns {Promise<Object|undefined>} - updated object
   */
  async update( id, payload ) {
    try {
      const res = await client.patch( `${ this.type }/${ id }`, payload );

      return res.data;
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to update ${ this.type } (${ err.message } )`,
        type: 'danger'
      }) );

      return {};
    }
  }

  /**
   * Delete a object (handles errors with notifications)
   * @param {String} id - id of object to delete
   * @returns {Promise<undefined>}
   */
  async destroy( id ) {
    try {
      await client.delete( `${ this.type }/${ id }` );
    } catch ( err ) {
      store().dispatch( notify({
        message: `Failed to delete ${ this.type } (${ err.message } )`,
        type: 'danger'
      }) );
    }
  }

}

export default RestAPI;
