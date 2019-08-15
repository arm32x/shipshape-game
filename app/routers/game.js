/// ShipShape  >  routers  >  game
/// 	Handle requests for game pages and route them to the controller.

const express    = require('express');
const router     = express.Router();

const controller = require('../controllers/game.js');


router.get('/new', controller.new);

router.post('/', controller.create);

router.get('/:id', controller.show);


module.exports = router;
