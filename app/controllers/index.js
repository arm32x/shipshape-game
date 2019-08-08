/// ShipShape  >  controllers  >  index
/// 	Handle routes for miscellaneous pages throughout the app.

module.exports = {
	
	index: [
		function index_index(req, res, next) {
			res.render('index/index');
		}
	],

	test: [
		function index_test(req, res, next) {
			res.render('index/test');
		}
	]

};

