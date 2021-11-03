const logger = require( "@starryinternet/jobi" );
const mongoose    = require( "mongoose" );
const User     = require( "../models/user" );
const sendGrid = require( "../classes/sendGrid" );
const JWTUtils  = require( "../utils/jwt" );
const templates = require( "./emailTemplates/templates" );

const key =  getKey(); 

module.exports = new sendGrid({
  key,
  defaultEmail: "zachbarnes@socnet.org"
});

module.exports = {
  sendWelcomeEmail: async( req, res ) => {
    try {

      const decoded = JWTUtils.verifyJwt( req.body.token );

      const user = await User.findById( decoded.sub );

      console.log( user );

      const welcomeEmail = new templates
        .WelcomeEmail( user.username );

      sendGrid.send( user.email, welcomeEmail )
        .then( ( res ) => { res.send( res ); })
        .catch( ( err ) => { res.send( err ); });

    } catch ( err ) {
      res.status( 500 ).send( err );
      logger.log( "error", err.message );
    }
  }

};
