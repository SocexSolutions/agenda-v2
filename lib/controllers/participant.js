const Participant = require('../models/participant'),
      Meeting = require('../models/meeting');

module.exports = {
  create: async (req, res) => {
    const { firstName, lastName, email, meeting } = req.body;
    try {
      await Participant.create({ firstName, lastName, email, meeting });
      res.sendStatus(200);
    }
    catch {
      console.error("This be the err: ", err);
      res.status(500).send(error.message);
    }
  }
}
