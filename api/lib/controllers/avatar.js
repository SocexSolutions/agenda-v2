const Avatar = require("../models/avatar");

module.exports = {
  create: async (req, res) => {
    const subject_username = req.credentials.user.username;
    const subject_id = req.credentials.sub;

    const getColor = () => {
      return (
        "hsl(" +
        360 * Math.random() +
        "," +
        (25 + 70 * Math.random()) +
        "%," +
        (85 + 10 * Math.random()) +
        "%)"
      );
    };
    const initials = subject_username
      .match(/(\b\S)?/g)
      .join("")
      .match(/(^\S|\S$)?/g)
      .join("")
      .toUpperCase();

    const avatar = Avatar.create({
      color: getColor(),
      initials,
      user_id: subject_id,
    });

    res.status(200).send(avatar);
  }
};
