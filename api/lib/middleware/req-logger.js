const log = require('@starryinternet/jobi');

function reqLog( req, res, next ) {
  try {

    log.info( '*' + req.originalUrl );
    log.debug( 'request params: ' + JSON.stringify( req.params ) );
    log.debug( 'request body: ' + JSON.stringify( req.body ) );
    log.trace( req );

    const baseSend = res.send;

    res.send = ( data ) => {
      log.debug( 'response payload: ' + JSON.stringify( data ) );

      res.send = baseSend;

      return res.send( data );
    };

  } catch ( error ) {}

  next();
}

module.exports = reqLog;
