const Meeting = require("../models/meeting");
const Participant = require("../models/participant");

module.exports = {
  display: async(req, res) => {
    try {
      const meeting = await Meeting.findById(_id);

      res.sendStatus(200).send(meeting);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  create: async(req, res) => {
    const {owner_id, date} = req.body;

    try {
      await Meeting.create({owner_id, date});
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};
