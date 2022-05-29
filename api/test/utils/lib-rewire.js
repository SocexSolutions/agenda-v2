const rewire = require('rewire');

module.exports = ( path_in_lib ) => {
  const full_path = process.cwd() + '/' + path_in_lib;

  return rewire( full_path );
};
