/// ShipShape  >  controllers  >  maps
/// 	Handle serving maps from the JSON file.

let maps = require('../data/maps');

module.exports = {
	
	index: [
		function maps_index(req, res, next) {
			let page = req.query.page || 1;
			maps.find({ }).skip((page - 1) * 50).limit(50).exec((err, maps) => {
				if (err) {
					console.error(err);
					res.status(500).send(err); // TODO:  Make an actual error page.
					return;
				}
				res.render('maps/index', { maps });
			});
		}
	],
	
	new: [
		function maps_new(req, res, next) {
			res.render('maps/new');
		}
	]

};

