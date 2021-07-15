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
    for ( let collection in db.collections ) {
      await db.collections[ collection ].drop();
    }
  }
};

module.exports = utils;