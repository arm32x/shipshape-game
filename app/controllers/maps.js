/// ShipShape  >  controllers  >  maps
/// 	Handle serving maps from the JSON file.

let maps = require('../data/maps');

module.exports = {
	
	index: [
		function maps_index(req, res, next) {
			res.render('maps/index', { maps: maps });
		}
	],
	
	showJSON: [
		function maps_showJSON(req, res, next) {
			let id = req.params.id.toUpperCase();
			if (id in maps) {
				res.json(maps[id]);
			} else {
				res.status(404).end();
			}
		}
	]

};

