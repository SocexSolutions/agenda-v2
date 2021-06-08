const express = require( "express" );
const user    = require( "./routes/user" );
const db      = require( "./db" );

const app     = express();

//body parser is deprecated so in Express 4.16+ ( we have 4.17.1) we use these
// two lines for body parsing
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

app.use( "/user", user );

const port = process.env.PORT || 5000;

app.listen( port, () => console.log( "Agenda api listening on " + port ) );
