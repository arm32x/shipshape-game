/// ShipShape  >  controllers  >  game
/// 	Handle requests for the main game page and related functionality.

const validate = require('express-validator');
const socketIO = require('socket.io');

const maps = require('../data/maps');

let errors = { };
let games = { };

let io = undefined;

function deepEqual(x, y) {
	const ok = Object.keys, tx = typeof x, ty = typeof y;
	return x && y && tx === 'object' && tx === ty ? (
		ok(x).length === ok(y).length &&
			ok(x).every(key => deepEqual(x[key], y[key]))
	) : (x === y);
}

module.exports = {
	
	new: [
		function game_new(req, res, next) {
			res.render('game/new', { errors: errors });
			errors = { };
		}
	],
	
	create: [
		function game_create(req, res, next) {
			if (!io) {
				io = socketIO(req.connection.server);
			}
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
			
			let gameID;
			do {
				gameID = '';
				for (let index = 0; index < 8; index++) {
					if (index == 4) {
						gameID += '-';
					}
					gameID += '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
				}
			} while (gameID in games);
			
			games[gameID] = {
				id: gameID,
				map: maps[mapID],
				io: io.of('/game/' + gameID),
				started: false,
				maxPlayers: 2,
				player1: { connected: false },
				player2: { connected: false },
				turn: undefined
			};
			console.log("Created game " + gameID + ".");
			let game = games[gameID];
			
			let nextTurn = (signalPlayers = true) => {
				if (game.turn == 1) {
					game.turn = 2;
					if (signalPlayers) {
						game.player1.socket.emit('opponent turn');
						game.player2.socket.emit('player turn');
					}
				} else {
					game.turn = 1;
					if (signalPlayers) {
						game.player1.socket.emit('player turn');
						game.player2.socket.emit('opponent turn');
					}
				}
			};
			
			game.io.on('connection', (socket) => {
				if (!(game.player1.connected && game.player2.connected)) {
					
					console.log("Player with ID " + socket.id + " joined game " + gameID + ".");
					
					let player = undefined;
					let playerNo = undefined;
					if (!game.player1.connected) {
						console.log("Connected as player 1.");
						game.player1.socket = socket;
						game.player1.connected = true;
						player = game.player1;
						playerNo = 1;
					} else if (!game.player2.connected) {
						console.log("Connected as player 2.");
						game.player2.socket = socket;
						game.player2.connected = true;
						player = game.player2;
						playerNo = 2;
					}
					if (game.player1.connected && game.player2.connected) {
						game.started = true;
					}

					if (player.ships != undefined) {
						for (let ship of player.ships) {
							socket.emit('ship place', { ...ship, removeShip: true });
						}
						if (deepEqual(player.shipCount, game.map.ships)) {
							socket.emit('player ready');
						}
						if (game.turn == undefined) {

						} else if (game.turn == playerNo) {
							socket.emit('player turn');
						} else {
							socket.emit('opponent turn');
						}
					}
					
					let getTile = (player, x, y) => {
						return player.board[y][x];
					};
					let setTile = (player, x, y, tx, ty) => {
						player.board[y][x] = { x: tx, y: ty };
					};
					
					socket.on('disconnect', () => {
						console.log("Player with ID " + socket.id + " left game " + gameID + ".");
						if (game.player1.socket.id == socket.id) {
							console.log("Player 1 disconnected.");
							game.player1.connected = false;
						} else if (game.player2.socket.id == socket.id) {
							console.log("Player 2 disconnected.");
							game.player2.connected = false;
						}
						if (!game.player1.connected && !game.player2.connected) {
							console.log("An in-progress game was adbandoned.  Closing game.");
							game.io.emit('game close');
							delete io.nsps['/game/' + gameID];
							delete games[gameID];
						}
					});
					
					socket.on('ship place', (shipData) => {
						if (player.ships == undefined) player.ships = [ ];
						if (player.shipCount == undefined) player.shipCount = { 'carrier': 0, 'battleship': 0, 'submarine': 0, 'destroyer': 0, 'patrolBoat': 0 };
						
						let shipLength;
						/**/ if (shipData.type == 'patrolBoat') shipLength = 2;
						else if (shipData.type == 'destroyer')  shipLength = 3;
						else if (shipData.type == 'submarine')  shipLength = 3;
						else if (shipData.type == 'battleship') shipLength = 4;
						else if (shipData.type == 'carrier')    shipLength = 5;
						
						let vertical = shipData.direction == 'up' || shipData.direction == 'down';
						
						let boardWidth  = game.map.targeting[0].length - 1;
						let boardHeight = game.map.targeting.length - 1;
						if (player.board == undefined) player.board = Array.from({ length: boardHeight }, () => Array(boardWidth).fill({ x: 0, y: 5 }));
						
						if (!vertical && shipData.x > boardWidth - shipLength) {
							console.log("Player with ID " + socket.id + " attempted to place a ship in an invalid position.");
							socket.emit('ship error', shipData);
							return;
						} else if (vertical && shipData.y > boardHeight - shipLength) {
							console.log("Player with ID " + socket.id + " attempted to place a ship in an invalid position.");
							socket.emit('ship error', shipData);
							return;
						}
						
						if (player.shipCount[shipData.type] >= game.map.ships[shipData.type]) {
							console.log("Player with ID " + socket.id + " attempted to place too many ships.");
							socket.emit('ship error', shipData);
							return;
						}
						
						for (let distance = 0; distance < shipLength; distance++) {
							if (!vertical) {
								if (getTile(player, shipData.x + distance, shipData.y).x != 0 || getTile(player, shipData.x + distance, shipData.y).y != 5) {
									console.log("Player with ID " + socket.id + " attempted to place a ship on top of a ship.");
									socket.emit('ship error', shipData);
									return;
								};
							} else {
								if (getTile(player, shipData.x, shipData.y + distance).x != 0 || getTile(player, shipData.x, shipData.y + distance).y != 5) {
									console.log("Player with ID " + socket.id + " attempted to place a ship on top of a ship.");
									socket.emit('ship error', shipData);
									return;
								};
							}
						}
						
						console.log("Player with ID " + socket.id + " placed a " + shipData.type + " " + shipData.direction + " at (" + shipData.x + ", " + shipData.y + ").");
						shipData.sunk = false;
						player.ships.push(shipData);
						player.shipCount[shipData.type]++;
						socket.emit('ship place', shipData);
						
						let { x, y } = shipData;
						let shipType = shipData.type;
						let shipDirection = shipData.direction;
						
						switch (shipType) {
							case 'patrolBoat':
								switch (shipDirection) {
									case 'up':
										setTile(player, x, y,     0, 8);
										setTile(player, x, y + 1, 0, 9);
										break;
									case 'down':
										setTile(player, x, y,     0, 0);
										setTile(player, x, y + 1, 0, 1);
										break;
									case 'left':
										setTile(player, x, y,     8, 4);
										setTile(player, x + 1, y, 9, 4);
										break;
									case 'right':
										setTile(player, x, y,     5, 5);
										setTile(player, x + 1, y, 6, 5);
										break;
								}
								break;
							case 'destroyer':
								switch (shipDirection) {
									case 'up':
										setTile(player, x, y,     1, 7);
										setTile(player, x, y + 1, 1, 8);
										setTile(player, x, y + 2, 1, 9);
										break;
									case 'down':
										setTile(player, x, y,     1, 0);
										setTile(player, x, y + 1, 1, 1);
										setTile(player, x, y + 2, 1, 2);
										break;
									case 'left':
										setTile(player, x, y,     7, 3);
										setTile(player, x + 1, y, 8, 3);
										setTile(player, x + 2, y, 9, 3);
										break;
									case 'right':
										setTile(player, x, y,     5, 6);
										setTile(player, x + 1, y, 6, 6);
										setTile(player, x + 2, y, 7, 6);
										break;
								}
								break;
							case 'submarine':
								switch (shipDirection) {
									case 'up':
										setTile(player, x, y,     2, 7);
										setTile(player, x, y + 1, 2, 8);
										setTile(player, x, y + 2, 2, 9);
										break;
									case 'down':
										setTile(player, x, y,     2, 0);
										setTile(player, x, y + 1, 2, 1);
										setTile(player, x, y + 2, 2, 2);
										break;
									case 'left':
										setTile(player, x, y,     7, 2);
										setTile(player, x + 1, y, 8, 2);
										setTile(player, x + 2, y, 9, 2);
										break;
									case 'right':
										setTile(player, x, y,     5, 7);
										setTile(player, x + 1, y, 6, 7);
										setTile(player, x + 2, y, 7, 7);
										break;
								}
								break;
							case 'battleship':
								switch (shipDirection) {
									case 'up':
										setTile(player, x, y,     3, 6);
										setTile(player, x, y + 1, 3, 7);
										setTile(player, x, y + 2, 3, 8);
										setTile(player, x, y + 3, 3, 9);
										break;
									case 'down':
										setTile(player, x, y,     3, 0);
										setTile(player, x, y + 1, 3, 1);
										setTile(player, x, y + 2, 3, 2);
										setTile(player, x, y + 3, 3, 3);
										break;
									case 'left':
										setTile(player, x, y,     6, 1);
										setTile(player, x + 1, y, 7, 1);
										setTile(player, x + 2, y, 8, 1);
										setTile(player, x + 3, y, 9, 1);
										break;
									case 'right':
										setTile(player, x, y,     5, 8);
										setTile(player, x + 1, y, 6, 8);
										setTile(player, x + 2, y, 7, 8);
										setTile(player, x + 3, y, 8, 8);
										break;
								}
								break;
							case 'carrier':
								switch (shipDirection) {
									case 'up':
										setTile(player, x, y,     4, 5);
										setTile(player, x, y + 1, 4, 6);
										setTile(player, x, y + 2, 4, 7);
										setTile(player, x, y + 3, 4, 8);
										setTile(player, x, y + 4, 4, 9);
										break;
									case 'down':
										setTile(player, x, y,     4, 0);
										setTile(player, x, y + 1, 4, 1);
										setTile(player, x, y + 2, 4, 2);
										setTile(player, x, y + 3, 4, 3);
										setTile(player, x, y + 4, 4, 4);
										break;
									case 'left':
										setTile(player, x, y,     5, 0);
										setTile(player, x + 1, y, 6, 0);
										setTile(player, x + 2, y, 7, 0);
										setTile(player, x + 3, y, 8, 0);
										setTile(player, x + 4, y, 9, 0);
										break;
									case 'right':
										setTile(player, x, y,     5, 9);
										setTile(player, x + 1, y, 6, 9);
										setTile(player, x + 2, y, 7, 9);
										setTile(player, x + 3, y, 8, 9);
										setTile(player, x + 4, y, 9, 9);
										break;
								}
								break;
						}
						
						if (deepEqual(player.shipCount, game.map.ships)) {
							console.log("Player with ID " + socket.id + " has placed all of their battleships and is now ready.");
							player.ready = true;
							socket.emit('player ready');
							if (game.player1 && game.player1.ready && game.player2 && game.player2.ready) {
								setTimeout(nextTurn, 500);
							}
						}
					});

					socket.on('fire', (target) => {
						if (socket.id != game["player" + game.turn].socket.id) return;
						
						console.log("Player with ID " + socket.id + " fired at " + target + ".");
						
						nextTurn(false);
						let nextTurnTimeout = undefined;
						let targetPlayer = game["player" + game.turn].socket.id;
						let hit = false;
						checkTarget: {
							for (let y = 0; y < game.map.targeting.length - 1; y++) {
								for (let x = 0; x < game.map.targeting[y + 1].length - 1; x++) {
									if (game.map.targeting[y + 1][x + 1].toLowerCase() == target.toLowerCase()) {
										let tile = getTile(targetPlayer, x, y);
										if (tile.x == 0 && tile.y == 5) {
											socket.emit('miss', { x: x, y: y, board: 'opponent' });
											targetPlayer.socket.emit('miss', { x: x, y: y, board: 'player' });
											setTile(targetPlayer, x, y, 1, 4);
										} else if (tile.x == 0 && tile.y == 4) {
											hit = true;
											socket.emit('hit', { x: x, y: y, board: 'opponent' });
											targetPlayer.socket.emit('hit', { x: x, y: y, board: 'player' });
											setTile(targetPlayer, x, y, 0, 4);
										} else if (tile.x == 1 && tile.y == 4) {
											socket.emit('miss', { x: x, y: y, board: 'opponent' });
											targetPlayer.socket.emit('miss', { x: x, y: y, board: 'player' });
											setTile(targetPlayer, x, y, 1, 4);
										} else if (tile.x == 1 && tile.y == 5) {
											socket.emit('miss', { x: x, y: y, board: 'opponent' });
											targetPlayer.socket.emit('miss', { x: x, y: y, board: 'player' });
											setTile(targetPlayer, x, y, 1, 4);
										} else {
											hit = true;
											socket.emit('hit', { x: x, y: y, board: 'opponent' });
											targetPlayer.socket.emit('hit', { x: x, y: y, board: 'player' });
											setTile(targetPlayer, x, y, 0, 4);
										}
										nextTurnTimeout = setTimeout(() => {
											nextTurn(false);
											nextTurn(true);
										}, 3000);
										break checkTarget;
									}
								}
							}
							nextTurn(false);
							socket.emit('target invalid');
							targetPlayer.socket.emit('target invalid');
							nextTurnTimeout = setTimeout(() => {
								nextTurn(false);
								nextTurn(true);
							}, 3000);
						}
						
						let allSunk = true;
						for (let shipData of targetPlayer.ships) {
							let shipLength;
							/**/ if (shipData.type == 'patrolBoat') shipLength = 2;
							else if (shipData.type == 'destroyer')  shipLength = 3;
							else if (shipData.type == 'submarine')  shipLength = 3;
							else if (shipData.type == 'battleship') shipLength = 4;
							else if (shipData.type == 'carrier')    shipLength = 5;
							
							let vertical = shipData.direction == 'up' || shipData.direction == 'down';
							
							let justSunk = !shipData.sunk;
							for (let distance = 0; distance < shipLength; distance++) {
								shipData.sunk = true;
								if (!vertical) {
									if (getTile(targetPlayer, shipData.x + distance, shipData.y).x != 0 || getTile(targetPlayer, shipData.x + distance, shipData.y).y != 4) {
										shipData.sunk = false;
										allSunk = false;
										break;
									};
								} else {
									if (getTile(targetPlayer, shipData.x, shipData.y + distance).x != 0 || getTile(targetPlayer, shipData.x, shipData.y + distance).y != 4) {
										shipData.sunk = false;
										allSunk = false;
										break;
									};
								}
							}
							if (shipData.sunk && justSunk) {
								setTimeout(() => {
									socket.emit('sunk', shipData);
									targetPlayer.socket.emit('sunk', shipData);
								}, 1000);
							}
						}
						if (allSunk) {
							clearTimeout(nextTurnTimeout);
							nextTurn(false);
							setTimeout(() => {
								socket.emit('win');
								targetPlayer.socket.emit('loss');
							}, 2000);
						}
						
						if (!hit && Math.random() < 0.0001) {
							setTimeout(() => {
								socket.emit('sunk', { type: 'fish' });
								targetPlayer.socket.emit('sunk', { type: 'fish' } );
							}, 1000);
						}
					});
					
				} else {
					console.log("Player with ID " + socket.id + " attempted to join full game " + gameID + ".");
					socket.emit('game full');
					socket.disconnect(true);
				}
			});
			
			res.redirect('/game/' + gameID);
		}
	],
	
	show: [
		function game_show(req, res, next) {
			let game = games[req.params.id];
			if (game) {
				res.render('game/show', { game: game });
			} else {
				res.redirect('/game/join');
			}
		}
	],
	
	join: [
		function game_join(req, res, next) {
			res.render('game/join', { errors: errors });
			errors = { };
		}
	],
	
	join2: [
		function game_join2(req, res, next) {
			let gameID = req.body['game-id'];
			if (typeof gameID == 'undefined' || gameID == '') {
				errors = { 'game-id': "This field is required." };
				res.redirect('/game/join');
				return;
			}
			gameID = gameID.toUpperCase().trim();
			if (!/^[0-9A-F]{4}-[0-9A-F]{4}$/.test(gameID)) {
				errors = { 'game-id': "The game ID is invalid." };
				res.redirect('/game/join');
				return;
			} else if (!(gameID in games)) {
				errors = { 'game-id': "The selected game does not exist." };
				res.redirect('/game/join');
				return;
			}
			
			res.redirect('/game/' + gameID);
		}
	]
	
};
