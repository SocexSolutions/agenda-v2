const User      = require('../models/user');
const Meeting   = require('../models/meeting');
const PassUtils = require('../util/password');
const JWTUtils  = require('../util/jwt');
const Auth      = require('../util/authorization');


module.exports = {
  async register( req, res ) {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if ( existingUser ) {
      return res.status( 403 ).json({
        success: false,
        msg: 'Username Already Exists'
      });
    }

    if ( !password ) {
      return res.status( 401 ).json({
        success: false,
        msg: 'Invalid Credentials'
      });
    }

    const { hash, salt } = PassUtils.genPassword( password );

    const newUser = {
      email,
      username,
      hash,
      salt
    };

    const user = await User.create( newUser );

    const { token, expiresIn } = JWTUtils.issueJWT( user, true );

    return res.status( 201 ).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username
      },
      token,
      expiresIn
    });
  },

  async login( req, res ) {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if ( !user ) {
      return res.status( 401 ).json({
        success: false,
        msg: 'Invalid Credentials'
      });
    }

    const valid = PassUtils.validatePassword(
      password,
      user.hash,
      user.salt
    );

    if ( valid ) {
      const { token, expiresIn } = JWTUtils.issueJWT( user, true );

      return res.status( 200 ).json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username
        },
        token,
        expiresIn
      });

    } else {
      return res.status( 401 ).json({
        success: false,
        msg: 'Invalid Credentials'
      });
    }
  },

  async refresh( req, res ) {
    const token = req.headers.authorization;

    const decoded = JWTUtils.verifyJWT( token );

    const user = await User.findById( decoded.sub );

    if ( !user ) {
      return res.status( 401 ).json({
        success: false,
        msg: 'Invalid Credentials'
      });
    }

    return res.status( 200 ).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username
      }
    });
  },

  async getOwnedMeetings( req, res ) {
    Auth.check_user( req.credentials );

    const { sub } = req.credentials;

    const meetings = await Meeting.find({ owner_id: sub });

    return res.status( 200 ).json( meetings );
  },

  async checkExistingUsername( req, res ) {
    const { username } = req.body;

    const existingUser = await User.findOne({ username });

    if ( existingUser ) {
      return res.status( 409 ).send(
        new Error('Username already exists')
      );

    } else {
      return res.status( 200 ).send();
    }
  },

  async checkExistingEmail( req, res ) {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if ( existingUser ) {
      return res.status( 409 ).send(
        new Error('Email already exists')
      );

    } else {
      return res.status( 200 ).send();
    }
  }
};
