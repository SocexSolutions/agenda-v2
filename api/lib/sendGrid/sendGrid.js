const logger    = require('@starryinternet/jobi');
const sendGrid  = require('../classes/sendGrid');
const templates = require('./emailTemplates/templates');


module.exports = new sendGrid({
  key,
  defaultEmail: 'zachbarnes@socnet.org'
});

module.exports = {
  sendWelcomeEmail: ( username, email ) => {
    try {
      const welcomeEmail = new templates
      .WelcomeEmail( username );

      sendGrid.send( email, welcomeEmail )
      .then( ( res ) => { res.send( res ); } )
      .catch( ( err ) => { res.send( err ); } );

    } catch ( err ) {
      res.status( 500 ).send( err );
      logger.log( 'error', err.message );
    }
  }

};
