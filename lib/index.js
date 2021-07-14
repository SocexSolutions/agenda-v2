const express     = require("express");
const mongoose    = require("mongoose");
const db          = require("./db");
const passport    = require("passport");
const router      = require("./routes");

const app         = express();


const start = async() => {
  try {
    // first connect db
    await db.connect();

    // setup passport
    require("./config/passport")(passport);
    app.use(passport.initialize());

    //body parser is deprecated so in Express 4.16+ ( we have 4.17.1) we use
    // these two lines for body parsing
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/", router);

    const port = process.env.PORT || 5000;

    app.listen(port);

    console.log("AGENDA API LISTENING ON PORT: " + port);

  } catch (error) {

    console.error("AGENDA API STARTUP FAILED: " + error.message);
  }
};

start();
