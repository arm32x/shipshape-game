/// ShipShape -> controllers -> index.js
/// 	Handle routes for miscellaneous pages throughout the app.

module.exports = {
	
	index: [
		function index(req, res, next) {
			res.render('index/index');
		}
	]

};
