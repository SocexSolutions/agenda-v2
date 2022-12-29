const Avatar = require("../models/avatar");

module.exports = {
  get: async (req, res) => {
    const subject_id = req.credentials.sub;
    const avatar = await Avatar.findOne({ owner_id: subject_id });

    res.status(200).send(avatar);
  },

  create: async (req, res) => {
    const subject_username = req.credentials.user.username;
    const subject_id = req.credentials.sub;

    const getColor = () => {
      return (
        "hsl(" +
        360 * Math.random() +
        "," +
        '100%,50%)'
      );
    };

    const avatar = await Avatar.create({
      color: getColor(),
      user_id: subject_id
    });

    res.status(200).send(avatar);
  },
};
