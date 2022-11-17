const JWTUtils = require("../util/jwt");
const jobi = require("@starryinternet/jobi");
const User = require("../models/user");
const Participant = require("../models/user");

const authenticate = async (req, res, next) => {
  jobi.debug("authenticating");

  try {
    const auth = req.headers.authorization;

    const decoded = JWTUtils.verifyJWT(auth);

    if (decoded.usr) {
      const { email, username, _id, groups } = await User.findOne({
        _id: decoded.sub,
      });
      req.credentials = { ...decoded, user: { email, username, _id, groups } };
    } else {
      const { _id, email } = await Participant.findOne({ _id: decoded.sub });
      req.credentials = {
        ...decoded,
        participant: { _id, email },
      };
    }

    next();
  } catch (err) {
    jobi.error(err);

    res.status(401).json({ success: false, msg: "Forbidden" });
  }
};

module.exports = authenticate;
