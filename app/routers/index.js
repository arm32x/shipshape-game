/// ShipShape -> routes -> index.js
/// 	Handle requests for miscellaneous pages and route them to the controller.

const express    = require('express');
const router     = express.Router();

const controller = require('../controllers/index.js');


router.get('/', controller.index);


module.exports = router;

