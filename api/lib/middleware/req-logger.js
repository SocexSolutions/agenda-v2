const jobi = require('@starryinternet/jobi');

function reqLog( req, res, next ) {
  try {
    jobi.info( '*' + req.originalUrl );
    jobi.debug( 'request params: ' + JSON.stringify( req.params ) );
    jobi.debug( 'request body: ' + JSON.stringify( req.body ) );
    jobi.trace( req );

    const baseSend = res.send;

    res.send = ( data ) => {
      jobi.debug( 'response payload: ' + JSON.stringify( data ) );

      res.send = baseSend;

      return res.send( data );
    };

  } catch ( error ) {}

  next();
}

module.exports = reqLog;
