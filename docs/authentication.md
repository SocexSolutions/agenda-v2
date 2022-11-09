# Introduction

### Quick Definitions

*Authentication* - identify that the user is who they say they are

*Authorization* - what permissions does the user have

*O-Auth* - fancier authentication system that also adds in the ability to manage permissions with the o-auth provider (like google)

### Passport.js

Passport js is a middleware (it goes between our backend logit and the router). 

Steps:

1. Pickup the strategy authentication strategy that is being used
2. Is the user authenticated
    1. If authentication is succesful then let user into express route else go away
    2. If authentication fails return `401` status code (unauthorized)

### HTTP Headers

Headers are sent with every http request and give information about a given request. They can be broken into three categories:

*General Headers* - the general metadata like what type of request was made, what was the status code that was returned, what ip address was resolved by the DNS...

*Request Headers* - instructions for the server that the client is requesting data from like what type of data we accept (html, xml...), what route we are going to, what browser is being used also known as the `user-agent`,  

*Response Headers* - instructions for the client as to how to interact with the server, gives what kind of data was sent back, has the `set-cookie` header

For more info on headers see [https://developer.mozilla.org/en-US/docs/Web/HTTP/Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)s 

### Session and Cookies

The first thing to think about when thinking about cookies is that http is a *stateless protocol*, it will forget what the user has done on the site unless we have a way to remember that.

*Session* based authentication sends a cookie back to the browser which indicates the the user has been authenticated for additional requests by adding `set-cookie` in teh response header.

When the client reponds the next time it will send in the *request headers* a `cookie` with key value pairs for each of the cookies that were give in `set-cookie` by the initial response

Once the client has the cookie, the other thing to consider is how long the cookie should last. We do that with the `expires` piece of the http header.

# Middleware

Middle wearch are functions that the `request`, `response`, and `next` (callback) are passed through on their way to the routes. These parameters are passed to each route.  You can have as many of them as you want. If you want to go to the next step in the chain then you call `next` if you want to send something back imediately then you would do `response.send()` . 

In express, `app.use()` adds a piece to the chain of middleware. 

One pattern that is pretty common when chaining middleware and often come in handy is adding properties to the objects that are being passed through the middleware.

# Express Sessions

### Cookie

What is the difference between a session and a cookie? A session and a cookie are different in the places that they are stored. Cookies are stored in the browser and attached to ever http request that is sent by the client after succesful authentication and the server send back a `set-cookie` header with the cookie.

### Session

When using a session, the data is stored on the server side. This means that more data can be stored and confidential data can be stored.

## Sessions with Store in Mongo

With a session store, unlike a regular session, the session data will be stored in the database. This allows for a much greater amount of data to be stored as it is no longer being stored on the local system.

Most commonly this is done with `connect-mongo` and `express-session` which are npm packages that allow for the use of mongo stores which can be added to the express session system. 

### Setting Up a Session Store

```jsx
const session = require('express-session');
const passport = require('passport');
const connection = require('./config/database');

const MongoStore = require('connect-mongo')(session);

const sessionStore = new MongoStore({ 
  mongooseConnection: connection, 
  collection: 'sessions' 
});

require('dotenv').config();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
```

When authentication is succesful:

1. Session middleware initializes a session
2. Create session id and set the cookie equal to the `session_id` ( document in db in `sessions` store ) 
3. The cookie is the put in the `set-cookie` header of the http response
4. The browser receives the cookie and sets the cookie in the browser, by default the name of the cookie will be `connect.sid` which stands for connect session id
5. Every request the browser sends that is within the time to live of the cookie it will be sent with the request

Once the session has been created you can use it to store data about the client. For example if you wanted to store how many times a user has visited your page you could add something to a route like:

```jsx
app.get( '/', (req, res, next) => {
	
	req.session.viewCount = req.session.viewCount ? req.session.viewCount++ : 1;

	res.send('<h1>You have visited this page ${req.session.viewCount} time(s).</h1>');
})
```

# Passport Local Strategy

### Verify Callback and Strategy

When using a local strategy in passport, the first step is to create a function that passport will use to verify a user. All this means is checking the user session store that passport uses for the user. We then create an instance of a strategy and pass it to passport. Finally we add serialize and deserialize user described a bit farther down. Essentially they tell passport how to add a user (serialize) and how to get a user (deserialize).

```jsx
const passport         = require( "passport" );
const LocalStrategy    = require( "passport-local" );
const db               = require( "../db" );
const validatePassword = require( "../auth/passwordUtils" );

const User = db.models.User;

// verify callback used by strategy (our implementation of cred ver)
const verifyCallback = ( username, password, done ) => {

  User.find({ username: username })
    .then( ( user ) => {

      if ( !user ) {
        // on failure passport will return a 401
        return done( null, false );
      }

      const isValid = validatePassword( password, user.hash, user.salt );

      if ( isValid ) {
        return done( null, user );
      } else {
        return done( null, false );
      }

    })
    .catch( ( error ) => {
      done( error );
    });

};

// create a strategy
const strategy = new LocalStrategy( verifyCallback );

passport.use( strategy );

passport.serializeUser( ( user, done ) => {
  done( null, user.id );
});

passport.deserializeUser( ( userId, done ) => {

  User.findById( userId )
    .then( ( user ) => {
      done( null, user );
    })
    .catch( ( error ) => {
      done( error );
    });

});
```

### Add Passport to Middleware of Route

In epxress each of the functions essentially act as a data pipeline. In the below example, we add `passport.authenticate` to this pipeline which will cause the passport middleware to run when route is hit.

```jsx
router.post( "/login",
  passport.authenticate( "local",
    {
      failureRedirect: "/login-failure",
      successRedirect: "/login-success"
    }
  )
);

router.post( "/register", ( req, res, next ) => {
  const saltHash = genPassword( req.body.password );

  const  salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new user({
    username: req.body.username,
    hash: hash,
    salt: salt,
    admin: true
  });

  newUser.save()
    .then( ( newUser ) => {
      console.log( newUser );
    });

  res.redirect( "/login" );
});
```

### Initialize Passport and Session in App.js

There are a few things going on here. After we get the basic app setup with a database and express, we create a `MongoStore` that will be used by `express-session` to store its authentication state. We then create the collection associated with the mongo store. 

The next step is to tell express to use `express-session` and do some configuration for it most importantly specifying our store, the max age of the cookie, and the secret.

Finally we add our configured session based auth to express with passport as configured above.

```jsx
const express    = require( "express" );
const mongoose   = require( "mongoose" );
const session    = require( "express-session" );
const passport   = require( "passport" );
const crypto     = require( "crypto" );
const routes     = require( "./routes" );
const db         = require( "./db" );

const MongoStore = require( "connect-mongo" )( session );

const app = express();

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

// setup passport store
const sessionStore = new MongoStore({
  mongooseConnection: db,
  collection: "sessions"
});

// get access to .env file
require( "dotenv" ).config();

// configure express-session (passport will use this)
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// pull in passport config
require( "./auth/passport" );

app.use( passport.initialize() );
app.use( passport.session() );

app.use( routes );

app.listen( 3000 );
```

Each time we go to a route `app.use( passport.initialize() );` creates a passport instance which with a config file. We then provide passport with a refrences to `express session` with `app.use( passport.session() )` which will show passport where to look for the sesson data.

### Creating Password & Verifying Password

When a new user creates a username and password we will need to store it in our database securely. This can be done by taking the password that has been sent to us in plain text (we can't do anything about that) and hasing and salting it. 

```jsx
function genPassword( password ) {
  const salt = crypto.randomBytes( 32 ).toString( "hex" );

  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    10000,
    64,
    "sha512"
  ).toString( "hex" );

  return {
    salt,
    hash
  };
}
```

Later, when a user goes to sign in to our app with the password we can verify that it is legit by performing the same hash and salt operation and comparing the result with what we have stored in the db.

```jsx
function validatePassword( password, hash, salt ) {

  const reqHash = crypto.pbkdf2Sync(
    password,
    salt,
    10000,
    64,
    "sha512"
  ).toString( "hex" );

  return reqHash === hash;
}
```

### Serialize and Deserialize Users

When a user is authenticated, passport runs `passport.serializeUser` which adds the `passport` prop to the session with the user id in the below example.

```jsx
passport.serializeUser( ( user, done ) => {
  done( null, user.id );
});
```

The deserialize user function is used when we try to get the user from passport with `req.user` . This is implemented below.

```jsx
passport.deserializeUser( ( userId, done ) => {

  User.findById( userId )
    .then( ( user ) => {
      done( null, user );
    })
    .catch( ( error ) => {
      done( error );
    });

});
```

# Public Key Cryptography

Public key cryptography is a form of asymetric cryptography because you have a public key and a private key.

## Use Cases

### Encrypting a Message

With public and private key cryptography, messages that are encrypted with the public key can only be decrupted with the private key. This allows for the sender of a message to encrypt data with the public key and know that the only person that will be able to read that message is the person with the private key.

### Verifying Identity

The second use case of public and private key cryptography is to verify that a message was written by a sender. A message that is encrypted with a private key can only be decrypted with a public key. This means that only the person that holds the correct private key can send a message that can be decrypted with their public key. This allows the reciever to know that they have data that was send by the person with the private key.

## Underlying Math

Public and private key cryptography is base around *elliptic curve multiplication* which allows for a given number ( the private key ) to be able to generate a public key. However, the reverse it not possible. The math behind it allows you to verify that the public key corresponds to the private key but you does not allow you to derive the private key. 

# JSON Web Tokens

### Background

A *json web token* is a very common method to transport data across the internet. It has three parts, the header, the payload, and the signature. In the encoded version they are seperated by a period. The signature can use either symetric to asymatric cryptography to show that the web token is authentic (that it came from the right person). In the below example we will be using public key cryptography which is a form of asymetric cryptography by using the RSASHA256 hasing algorithm.

*base 64 url encoding* - the spec that is used to standardize character sets in urls, it is used to encode our web tokens and creates a standard for how large of data packets should be sent

The payload of the message is almost always metadata about an entity. Most of the the time it has to do with a user.

There are many *claims* that go in the JWT spec which are standardized names for different properties contained in a JWT payload object. `iat` is a very common claim and stands for issued at. Another common claim is `iss` which stands for issuer. This is who created the token. These *claims* are often verified by certificat authority who acts as the third party authority trusted to issue JWT tokens. The `sub` claim stands for subject and identifies who or what the information in the JWT belongs to. There is a `aud` claim that decides which servers the token should give access to and in what context.

### Client Server Interaction

1. Client says Hi, I want to log in to you application here are my credentials
2. Server - ok let me validate your credentials
3. Server - alright, looks good here is a JWT that I have signed with my private key 
4. Client - thanks for the JWT I am going to store this in *local storage* till it expires
5. Client - i wanna see this thing
6. Server - ok lemme check your JWT decrypting it with my public key
7. Server - looks good here you go

# Express JWT

### Options

There are three options available when you go though creating a JWT authentication system. The most complex option is to use the NodeJS crypto library and write your own middleware to sign and verify JWTs. This would be used when you want to build you own authentication framework. The next slightly less complex option is to the *jsonwebtoken* npm module and write your own middleware. The lest complext option is to use the *jsonwebtoken* npm module in combination with *passport-jwt*.

### Authentication Process

1. Client logs in to teh web app, and is issued a JSON Web Token
2. Client stores the JWT in `local storage` or as a *Cookie*
3. On each subsequent HTTP request that requires authentication, the client will attache the JWT in the `Authorization` HTTP header
4. The server looks for the JWT in the `Authorization` HTTP header and verifies its signature
5. If the signature is valid, the server decodes teh JWT, usually gets teh databse ID of the uesr in the `payload.sub` field, looks the user up in the database, and stores the user object to use
6. The user receives the route data

# JWT Implementation

### Verify Callback & Strategy

The first part of creating a JWT auth system with passport is to create a `verify` callback. This is the callback that will run when someone is authenticated with passport. In the below example we use some functions for the JWT strategy. Mainly `ExtractJwt` which determines where in the header the token is located and the strategy implementation itself `JwtStrategy`. In the verify callback we use the public key to decrypt the token when we recieve it from a request to *verify* that the token was actually created by us.

```jsx
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const User = require('mongoose').model('User');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

const stategy = new Jwtstrategy( options, ( payload, done ) => {

  // use 'sub' field of jwt for the user id
  User.findOne({ _id: payload.sub })
    .then( ( user ) => {
      if ( user ) {
        return done( null, user );
      } else {
        return done( null, false );
      }
    })
    .catch( err => ( done( err, null ) ) );

});

module.exports = ( passport ) => {
  passport.use( stategy );
};
```

### Registering a User: Generating a Password

To register a user with a JWT, you need to create a new user. Using the hash and salt method it is required that a user have both a hash of the users password and the salt for the password. You can use the `crypto.randomBytes` method to create a unique salt for the user. To create the hash with a salt from the password you use the `crypto.pbkdf2Sync()` which is an implementation of the IEEE Password-Based Key Derivation Function 2 (PBKDF2).

```jsx
function genPassword( password ) {
  const salt = crypto.randomBytes( 32 ).toString( "hex" );
  const genHash = crypto.pbkdf2Sync( password, salt, 10000, 64, "sha512" )
    .toString( "hex" );

  return {
    salt: salt,
    hash: genHash
  };
}
```

### Registering a User: Issuing a JWT

After a user is succesfully registered they must be issued a JWT for authentication persistence. There are a few steps involved here. The token will need to keep track of the user in the database so we give the function the user object that was found or created in the database. The database id of this user will be kept in the token for reference under the `sub` key. The token will also need a time to live and issued at data (stored under `iat`).  In the blow example we use the *jsonwebtoken* libarary to sign the token by taking its contents and encrypting it with the private key. This allows for validation that we were the one that issued the token because only our public key will be able to decrypt this data with a result that matches the contents of the token.

```jsx
/**
 * @param {*} user - The user object.  We need this to set the JWT `sub`
 * payload property to the MongoDB user ID
 */
function issueJWT( user ) {
  const _id = user._id;

  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(
    payload,
    PRIV_KEY,
    { expiresIn: expiresIn, algorithm: "RS256" }
  );

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  };
}
```

### Registering a User: Route

In the route for registring a user, we wil use the utils that we created above to give the add the user to the database with a hashed a salted password and issue them a new JWT.

```jsx
router.post( "/register", function( req, res, next ) {
  const { hash, salt } = utils.genPassword( req.body.password );

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt
  });

  newUser.save()
    .then( ( user ) => {
      const jwt = utils.issueJWT( user );

      res.json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires
      });
    })
    .catch( err => next( err ) );

});
```

### Loging in a User: Password Verification

This is done in the utils file and essentially uses the hash and salt method on the input credentials using the salt from the user record and verifies that this new hash matches the other.

```jsx
function validPassword( password, hash, salt ) {
  const hashVerify = crypto.pbkdf2Sync( password, salt, 10000, 64, "sha512" )
    .toString( "hex" );

  return hash === hashVerify;
}
```

### Loging in a User: Route

To log in a user, the credentials that are given are first used to serach the database for a user by the username. If one is not found a 401 status is returned. Next, if a user is found we verify the password using the funtion above. If the user is verified correctly we issue them a new JWT otherwise 401 is returned.

```jsx
// Validate an existing user and issue a JWT
router.post( "/login", function( req, res, next ) {

  User.findOne({ username: req.body.username })
    .then( ( user ) => {
      if ( !user ) {
        return res.status( 401 ).json({
          success: false,
          msg: "could not find user" // should not give away info in prod
        });
      }

      // Function defined at bottom of app.js
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if ( isValid ) {
        const tokenObject = utils.issueJWT( user );

        res.status( 200 ).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires
        });
      } else {
        res.status( 401 ).json({
          success: false,
          msg: "you entered the wrong password" // should not give info in prod
        });
      }

    })
    .catch( ( err ) => {
      next( err );
    });
});
```

### Authenticating a User

When a request is received on a protected route you use the `passport.authenticate()` middleware to authenticate the user. All this does it run the `verify` callback function that was added when we configured passport. It will take the JWT from the authorization header of the request, encrypt the payload of the JWT with the private key, and compare it with the token that was included. If it matches, that means that the token must have been issued by us and is thus valid. If that process succeeds we will send back a response with a status of 200.

```jsx
router.get( "/protected",
  passport.authenticate( "jwt", { session: false }), ( req, res, next ) => {
    res.status( 200 ).json({
      success: true,
      msg: "You are successfully authenticated to this route!"
    });
  }
);
```