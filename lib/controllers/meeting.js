const Meeting = require("../models/meeting");

module.exports = {
  display: (req, res) => {
    const { owner, participants, date } = req.body;

    try {
      res.json({ owner, participants, date });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send("Something went wrong!");
      console.error("This be the err: ", err);
    }
  },
  create: async (req, res) => {
    try {
      await Meeting.create({ owner, participants, date });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send("Something went wrong!");
      console.error("This be the err: ", err);
    }
  },
};
