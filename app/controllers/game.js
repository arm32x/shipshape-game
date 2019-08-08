/// ShipShape  >  controllers  >  game
/// 	Handle requests for the main game page and related functionality.

module.exports = {
	
	index: [
		function game_index(req, res, next) {
			res.render('game/index');
		}
	],
	
	new: [
		function game_new(req, res, next) {
			res.render('game/new');
		}
	]
	
};
