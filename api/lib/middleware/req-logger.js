const jobi = require('@starryinternet/jobi');

function reqLog( req, res, next ) {
  try {
    jobi.info( 'url: ' + req.originalUrl );
    jobi.debug( 'params: ', req.params );
    jobi.debug( 'body: ', req.body );
    jobi.trace( req );

    const baseSend = res.send;

    res.send = ( data ) => {
      jobi.debug( 'response payload: ', data );

      res.send = baseSend;

      return res.send( data );
    };

  } catch ( error ) {}

  next();
}

module.exports = reqLog;
