/// ShipShape  >  controllers  >  index
/// 	Handle serving ungategorized pages.

const express    = require('express');
const router     = express.Router();

const controller = require('../controllers/index.js');


router.get('/', controller.index);


module.exports = router;
