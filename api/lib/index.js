const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // eslint-disable-line
const db = require("./db");
const router = require("./routes");
const jobi = require("@starryinternet/jobi");

const app = express();

const start = async () => {
  try {
    // first connect db
    await db.connect();

    // body parser is deprecated so in Express 4.16+ ( we have 4.17.1) we use
    // these two lines for body parsing
    app.use(express.json({ limit: "50mb" })); //max size mongodb data
    app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 10000 }));

    // cors
    if (process.env.NODE_ENV === "dev") {
      app.use(cors({ origin: "http://localhost:3000" }));
    }

    app.use("/api/v1", router);

    const port = process.env.PORT || 4000;

    app.listen(port);

    jobi.info("agenda api listening on port: " + port);
  } catch (error) {
    jobi.info("agenda api failed to start: " + error.message);
  }
};

start();
