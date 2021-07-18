
module.exports = {
  health: async( req, res ) => {
    res.sendStatus( 200 ).send( "ok" );
  }
};