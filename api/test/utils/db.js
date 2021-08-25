/**
 * Utils for testing regarding the database like clearing all data.
 */

const db = require( "../../lib/db" );

const utils = {

  /**
	 * Drops all collections (thus remove all data in db without deleting it)
	 *
	 * @returns {Promise}
	 */
  async clean() {
    let promises = [];

    for ( let collection in db.collections ) {
      promises.push( db.collections[ collection ].drop() );
    }

    return Promise.all( promises );
  }
};

module.exports = utils;