const User = require( "../models/user" );

module.exports = {
  create: async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
      await User.create({ firstName, lastName, email });
      res.sendStatus(200);
    } catch {
      res.status(500).send(error.message);
    }
  }
};
