/// ShipShape  >  controllers  >  index
/// 	Handle serving ungategorized pages.

module.exports = {
	
	index: [
		function index_index(req, res, next) {
			res.redirect('/maps');
		}
	],
	
	credits: [
		function index_credits(req, res, next) {
			res.render('index/credits');
		}
	]

};

