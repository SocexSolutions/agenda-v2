const log = require('@starryinternet/jobi');

function reqLog( req, res, next ) {
  try {

    log.info( '*' + req.originalUrl );
    log.debug( 'request params: ' + JSON.stringify( req.params ) );
    log.debug( 'request body: ' + JSON.stringify( req.body ) );
    log.trace( req );

  } catch ( error ) {}

  next();
}

module.exports = reqLog;
