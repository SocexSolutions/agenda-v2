const express = require("express");
const app = express();
const user = require("./routes/user");
const mongoose = require("mongoose");

mongoose.connect("mongodb://host.docker.internal:27017/agenda", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.on("open", () => {
  console.log("connected");
});

mongoose.set("useCreateIndex", true);

//body parser is deprecated so in Express 4.16+ ( we have 4.17.1) we use these two lines for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", user);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Agenda api listening on " + port));
