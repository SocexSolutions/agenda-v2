const User = require("../models/user");

module.exports = {
  create: async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
      await User.create({ firstName, lastName, email });
      res.sendStatus(200);
    } catch (err) {
      console.error("This be the err: ", err);
      res.status(500).send(error.message);
    }
  },
};
