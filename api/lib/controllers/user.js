const User = require("../models/user");
const ResetRequest = require("../models/reset-request");
const ObjectID = require("mongoose").Types.ObjectId;
const passUtils = require("../util/password");
const jwtUtils = require("../util/jwt");
const sendGrid = require("../sendgrid");
const jobi = require("@starryinternet/jobi");
const crypto = require("crypto");

module.exports = {
  async register(req, res) {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(403).json({
        success: false,
        msg: "Username Already Exists",
      });
    }

    if (!password) {
      return res.status(401).json({
        success: false,
        msg: "Invalid Credentials",
      });
    }

    const { hash, salt } = passUtils.genPassword(password);

    const newUser = {
      email,
      username,
      hash,
      salt,
    };

    const user = await User.create(newUser);

    const { token, expiresIn } = jwtUtils.issueJWT(user, true);

    sendGrid.sendWelcomeEmail(email, username);

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        groups: user.groups,
      },
      access_token: token,
      expires_in: expiresIn,
    });
  },

  async login(req, res) {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid Credentials",
      });
    }

    const valid = passUtils.validatePassword(password, user.hash, user.salt);

    if (valid) {
      const { token, expiresIn } = jwtUtils.issueJWT(user, true);

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          groups: user.groups,
        },
        access_token: token,
        expiresIn,
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "Invalid Credentials",
      });
    }
  },

  async refresh(req, res) {
    const { user } = req.credentials;

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        groups: user.groups,
      },
    });
  },

  async checkExistingUsername(req, res) {
    const { username } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).send(new Error("Username already exists"));
    } else {
      return res.status(200).send();
    }
  },

  async checkExistingEmail(req, res) {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send(new Error("Email already exists"));
    } else {
      return res.status(200).send();
    }
  },

  async resetRequest(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send(new Error("Email is required"));
    }

    const code = crypto.randomBytes(20).toString("hex");

    const user = await User.findOne({ email });

    // Make sure not to let users know if an email is registered or not
    if (!user) {
      return res.status(200).send();
    }

    await sendGrid.sendPasswordResetEmail({
      email,
      userId: user._id.toString(),
      username: user.username,
      resetCode: code,
    });

    await ResetRequest.create({
      user_id: user._id,
      code,
      expires: new Date(Date.now() + 1000 * 60 * 10),
    });

    return res.status(200).send();
  },

  async resetPassword(req, res) {
    const { resetCode, password, userId } = req.body;

    const resetRequest = await ResetRequest.findOne({
      user_id: userId,
      code: resetCode,
      expires: { $gt: Date.now() },
    });

    if (!resetRequest) {
      return res.status(401).send(new Error("Invalid reset code"));
    }

    const { hash, salt } = passUtils.genPassword(password);

    await User.updateOne({ _id: userId }, { hash, salt });

    await ResetRequest.deleteOne({ _id: resetRequest._id });

    return res.status(200).send();
  },

  groups: async (req, res) => {
    const userId = req.credentials.user._id;

    const grps = await User.aggregate([
      {
        $match: { _id: ObjectID(userId) },
      },
      {
        $lookup: {
          from: "groups",
          let: { user_groups: "$groups" },
          pipeline: [
            {
              $match: {
                $or: [
                  { $expr: { $in: [userId, "$owner_ids"] } },
                  { $expr: { $in: ["$_id", "$$user_groups"] } },
                ],
              },
            },
          ],
          as: "groups",
        },
      },
      {
        $project: {
          groups: 1,
        },
      },
    ]);

    res.status(200).send(grps[0].groups);
  },

  async actionItems(req, res) {
    const userId = req.credentials.user._id;
    let { completed, skip, limit } = req.query;

    const filters = [];

    if (completed) {
      filters.push({ $match: { completed: JSON.parse(completed) } });
    }

    if (!skip) {
      skip = 0;
    } else {
      skip = parseInt(skip);
    }

    if (!limit) {
      limit = 10;
    } else {
      limit = parseInt(limit);
    }

    jobi.debug(
      "action item params",
      JSON.stringify({ completed, skip, limit })
    );

    const actionItems = await User.aggregate([
      { $match: { _id: ObjectID(userId) } },
      {
        $lookup: {
          from: "actionitems",
          let: { user_email: "$email" },
          pipeline: [
            { $match: { $expr: { $in: ["$$user_email", "$assigned_to"] } } },
            ...filters,
            { $sort: { created_at: -1 } },
          ],
          as: "action_items",
        },
      },
      {
        $project: {
          action_items: {
            $slice: ["$action_items", skip, limit],
          },
          count: { $size: "$action_items" },
        },
      },
    ]);

    res.status(200).send(actionItems[0]);
  },
};
