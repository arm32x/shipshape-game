/// ShipShape  >  routers  >  index
/// 	Handle requests for map files and display pages.

const express    = require('express');
const router     = express.Router();

const controller = require('../controllers/maps.js');


router.get('/', controller.index);
router.get('/new', controller.new);


module.exports = router;
