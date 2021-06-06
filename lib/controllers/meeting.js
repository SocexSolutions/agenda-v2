const Meeting = require("../models/meeting");
const Participant = require("../models/participant");

module.exports = {
  display: async (req, res) => {
    try {
      const meeting = await Meeting.findOne({ "_id": id });
      
      res.sendStatus(200);
    } catch (err) {
      console.error("This be the err: ", err);
      res.status(500).send(error.message);
    }
  },
  create: async (req, res) => {
    const { owner, date } = req.body;
    try {
      await Meeting.create({ owner, date });
      res.sendStatus(200);
    } catch (err) {
      console.error("This be the err: ", err);
      res.status(500).send(error.message);
    }
  }
};
