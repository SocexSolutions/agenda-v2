const User      = require('../models/user');
const Meeting   = require('../models/meeting');
const PassUtils = require('../auth/password');
const JWTUtils  = require('../auth/jwt');
const log       = require('@starryinternet/jobi');


module.exports = {
  async register( req, res ) {
    try {
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

      const { token, expiresIn } = JWTUtils.issueJWT( user );

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

    } catch ( err ) {
      return res.status( 500 ).json({
        success: false,
        msg: 'Server Error'
      });
    }
  },

  async login( req, res ) {
    try {
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
        const { token, expiresIn } = JWTUtils.issueJWT( user );

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

    } catch ( err ) {
      log.error( err.message );

      return res.status( 500 ).json({
        success: false,
        msg: 'Server Error'
      });
    }
  },

  async refresh( req, res ) {
    try {
      const token = req.headers.authorization;

      const decoded = JWTUtils.verifyJwt( token );

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

    } catch ( err ) {
      log.error( err.message );

      res.status( 500 ).json({
        success: false,
        msg: 'Invalid Credentials'
      });
    }
  },

  async getOwnedMeetings( req, res ) {
    try {
      const { user } = req.credentials;

      const meetings = await Meeting.find({ owner_id: user._id });

      res.status( 200 ).json( meetings );
    } catch ( error ) {
      res.status( 500 ).send( error );
    }
  },

  async checkExistingUsername( req, res ) {
    try {
      const { username } = req.body;

      const existingUser = await User.findOne({ username });

      if ( existingUser ) {
        res.status( 409 ).send(
          new Error('Username already exists')
        );

      } else {
        res.status( 200 ).send();
      }

    } catch ( err ) {
      log.error( err.message );
    }
  },

  async checkExistingEmail( req, res ) {
    try {
      const { email } = req.body;

      const existingUser = await User.findOne({ email });

      if ( existingUser ) {
        res.status( 409 ).send(
          new Error('Email already exists')
        );

      } else {
        res.status( 200 ).send();
      }

    } catch ( err ) {
      log.error( err.message );
    }
  }
};
