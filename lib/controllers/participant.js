const Participant = require("../models/participant"),
  Meeting = require("../models/meeting");

module.exports = {
  create: async(req, res) => {
    const {firstName, lastName, email, meeting_id} = req.body;

    try {
      await Participant.create({firstName, lastName, email, meeting_id});
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
};
