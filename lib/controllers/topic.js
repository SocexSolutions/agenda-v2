const Topic = require('../models/topic'),
      Meeting = require('../models/meeting');

module.exports = {
  create: async (req, res) => {
    const { name, meeting, likes } = req.body;
    try {
      await Topic.create({ name, meeting, likes });
      res.sendStatus(200);
    }
    catch {
      console.error("This be the err: ", err);
      res.status(500).send(error.message);
    }
  }
}