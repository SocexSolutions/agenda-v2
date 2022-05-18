const mongoose = require('mongoose');

/**
 * Utils for testing regarding the database like clearing all data.
 */

const utils = {
  /**
   * Drops all collections (thus remove all data in db without deleting it)
   *
   * @param {string[]} - collection names to clean (cleans all if not specified)
   *
   * @returns {Promise}
   */
  async clean( collection_names ) {
    const conn       = mongoose.connection;
    const coll_names = collection_names || Object.keys( conn.collections );

    const promises = [];

    for ( const collection of coll_names ) {
      promises.push(
        mongoose.connection.collections[ collection ].deleteMany({})
      );
    }

    return Promise.all( promises );
  }
};

module.exports = utils;
