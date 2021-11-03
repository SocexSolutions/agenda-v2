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
  sendWelcomeEmail: ( username, email ) => {
    try {
      const welcomeEmail = new templates
        .WelcomeEmail( username );

      sendGrid.send( email, welcomeEmail )
        .then( ( res ) => { res.send( res ); })
        .catch( ( err ) => { res.send( err ); });

    } catch ( err ) {
      res.status( 500 ).send( err );
      logger.log( "error", err.message );
    }
  }

};
