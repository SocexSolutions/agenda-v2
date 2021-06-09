const express     = require("express");
const mongoose    = require("mongoose");
const db          = require( "./db" );

const user        = require("./routes/user");
const meeting     = require("./routes/meeting");
const topic       = require("./routes/topic");
const participant = require("./routes/participant");

const app         = express();

//body parser is deprecated so in Express 4.16+ ( we have 4.17.1) we use these
// two lines for body parsing
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

mongoose.set("useCreateIndex", true);

// body parser is deprecated so in Express 4.16+ ( we have 4.17.1) 
// we use these two lines for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", user);
app.use("/meeting", meeting);
app.use("/topic", topic);
app.use("/participant", participant);

const port = process.env.PORT || 5000;

app.listen( port, () => console.log( "Agenda api listening on " + port ) );
