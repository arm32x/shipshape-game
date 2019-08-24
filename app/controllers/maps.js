/// ShipShape  >  controllers  >  maps
/// 	Handle serving maps from the JSON file.

let maps = require('../data/maps');

module.exports = {
	
	index: [
		function maps_index(req, res, next) {
			res.render('maps/index', { maps: maps });
		}
	],
	
	new: [
		function maps_new(req, res, next) {
			res.render('maps/new');
		}
	]

};

