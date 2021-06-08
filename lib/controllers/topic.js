const Topic = require('../models/topic'),
      Meeting = require('../models/meeting');

module.exports = {
  create: async (req, res) => {
    const { name, meeting_id, likes } = req.body;
    try {
      await Topic.create({ name, meeting_id, likes });
      res.sendStatus(200);
    } catch {
      res.status(500).send(error.message);
    }
  }
}