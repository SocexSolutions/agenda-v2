const router         = require( "express" ).Router();
const userController = require( "../controllers/user" );
const passport       = require( "passport" );

router.post( "/register", userController.register );

router.post( "/login", userController.login );

router.get( "/protected",
  passport.authenticate( "jwt", { session: false }), ( req, res, next ) => {
    res.status( 200 ).json({
      success: true,
      msg: "you are successfully authenticated to this route!"
    });
  }
);

module.exports = router;
