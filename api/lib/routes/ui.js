const router              = require('express').Router();
const ui_controller       = require('../controllers/ui');
const { wrap_controller } = require('../util/error-wrapper');

const wrapped = wrap_controller( ui_controller );

router.get( '/:user_id', wrapped.get );
router.post( '/', wrapped.save );

module.exports = router;
