const mongoose = require( "mongoose" );

/**
 * Utils for testing regarding the database like clearing all data.
 */

const utils = {
  /**
   * Drops all collections (thus remove all data in db without deleting it)
   *
   * @returns {Promise}
   */
  async clean() {
    const collections = await mongoose.connection.db.collections();
    const promises = [];

    for ( let collection of collections ) {
      promises.push( collection.deleteMany({}) );
    }

    return Promise.all( promises );
  },
};

module.exports = utils;
