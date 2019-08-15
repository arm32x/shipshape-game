/// ShipShape  >  controllers  >  game
/// 	Handle requests for the main game page and related functionality.

const validate = require('express-validator');

const maps = require('../data/maps');

let errors = { };

let games = { };

module.exports = {
	
	new: [
		function game_new(req, res, next) {
			res.render('game/new', { errors: errors });
			errors = { };
		}
	],
	
	create: [
		function game_create(req, res, next) {
			let mapID = req.body['map-id'];
			if (typeof mapID == 'undefined' || mapID == '') {
				errors = { 'map-id': "This field is required." };
				res.redirect('/game/new');
				return;
			}
			mapID = mapID.toUpperCase().trim();
			if (!/^[0-9A-F]{4}-[0-9A-F]{4}$/.test(mapID)) {
				errors = { 'map-id': "The map ID is invalid." };
				res.redirect('/game/new');
				return;
			} else if (!(mapID in maps)) {
				errors = { 'map-id': "The selected map does not exist." };
				res.redirect('/game/new');
				return;
			}
			
			let gameID = '';
			for (let index = 0; index < 8; index++) {
				if (index == 4) {
					gameID += '-';
				}
				gameID += '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
			}
			
			games[gameID] = {
				id: gameID,
				map: maps[mapID]
			};
			
			res.redirect('/game/' + gameID);
		}
	],
	
	show: [
		function game_show(req, res, next) {
			res.render('game/show', { game: games[req.params.id] });
		}
	]
	
};
