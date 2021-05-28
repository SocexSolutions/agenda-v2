const Meeting = require("../models/meeting");

module.exports = {
  display: (req, res) => {
    try {
      const meeting = await Meeting.findOne({ "_id": id });
      res.sendStatus(200);
    } catch (err) {
      console.error("This be the err: ", err);
      res.status(500).send(error.message);
    }
  },
  create: async (req, res) => {
    const { owner, participants, date } = req.body;
    try {
      await Meeting.create({ owner, participants, date });
      res.sendStatus(200);
    } catch (err) {
      console.error("This be the err: ", err);
      res.status(500).send(error.message);
    }
  },
};
