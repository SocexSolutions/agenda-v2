const { key } = require( "../keys/emailKey.json" );
const logger = require( "@starryinternet/jobi" );
const mongoose    = require( "mongoose" );
const User     = require( "../models/user" );
const sgMail = require( "@sendgrid/mail" );
const JWTUtils  = require( "../utils/jwt" );
const templates = require( "./emailTemplates/templates" );

const API_KEY = key;

module.exports = {
  sendWelcomeEmail: async( req, res ) => {

    sgMail.setApiKey( API_KEY );

    try {

      const decoded = JWTUtils.verifyJwt( req.body.token );

      const user = await User.findById( decoded.sub );

      console.log( user );

      const sender = "zachbarnes@socnet.org";

      const email = new templates
        .WelcomeEmail( user.username, user.email, sender );

      console.log( email );

      sgMail.send( email, function( err, data ) {
        if( err ) {
          res.send( err );
        }
        else {
          res.send( data );
        }
      });
    } catch ( err ) {
      res.status( 500 ).send( err );
      logger.log( "error", err.message );
    }
  }

};
