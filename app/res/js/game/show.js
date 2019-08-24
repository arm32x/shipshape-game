/// ShipShape  >  res  >  js  >  game  >  show
///		 Controls the main game on the client side.

let statusBar = document.getElementsByClassName('shp-game-header__status')[0];
function setStatus(status) {
	statusBar.innerText = status;
}

function getTile(board, x, y) {
	return document.querySelector('.shp-game-board--' + board + ' .shp-game-board__tile[data-x="' + x + '"][data-y="' + y + '"]');
}
function setTileGraphic(tile, gfxX, gfxY) {
	tile.className = '';
	tile.classList.add('shp-game-board__tile');
	tile.classList.add('shp-game-board__tile--' + gfxX + '-' + gfxY);
}

function rotateShips() {
	let ships = document.querySelectorAll('.shp-game-ship-case .shp-ship:not(.draggable--original):not(.draggable-mirror)');
	for (let ship of ships) {
		if (ship.classList.contains('shp-ship--facing-right')) {
			ship.classList.replace('shp-ship--facing-right', 'shp-ship--facing-down');
			continue;
		}
		if (ship.classList.contains('shp-ship--facing-down')) {
			ship.classList.replace('shp-ship--facing-down', 'shp-ship--facing-left');
			continue;
		}
		if (ship.classList.contains('shp-ship--facing-left')) {
			ship.classList.replace('shp-ship--facing-left', 'shp-ship--facing-up');
			continue;
		}
		if (ship.classList.contains('shp-ship--facing-up')) {
			ship.classList.replace('shp-ship--facing-up', 'shp-ship--facing-right');
			continue;
		}
	}
}

function placeShip(shipData) {
	let { x, y } = shipData;
	let shipType = shipData.type;
	let shipDirection = shipData.direction;
	
	switch (shipType) {
		case 'patrolBoat':
			switch (shipDirection) {
				case 'up':
					setTileGraphic(getTile('player', x, y),     0, 8);
					setTileGraphic(getTile('player', x, y + 1), 0, 9);
					break;
				case 'down':
					setTileGraphic(getTile('player', x, y),     0, 0);
					setTileGraphic(getTile('player', x, y + 1), 0, 1);
					break;
				case 'left':
					setTileGraphic(getTile('player', x, y),     8, 4);
					setTileGraphic(getTile('player', x + 1, y), 9, 4);
					break;
				case 'right':
					setTileGraphic(getTile('player', x, y),     5, 5);
					setTileGraphic(getTile('player', x + 1, y), 6, 5);
					break;
			}
			break;
		case 'destroyer':
			switch (shipDirection) {
				case 'up':
					setTileGraphic(getTile('player', x, y),     1, 7);
					setTileGraphic(getTile('player', x, y + 1), 1, 8);
					setTileGraphic(getTile('player', x, y + 2), 1, 9);
					break;
				case 'down':
					setTileGraphic(getTile('player', x, y),     1, 0);
					setTileGraphic(getTile('player', x, y + 1), 1, 1);
					setTileGraphic(getTile('player', x, y + 2), 1, 2);
					break;
				case 'left':
					setTileGraphic(getTile('player', x, y),     7, 3);
					setTileGraphic(getTile('player', x + 1, y), 8, 3);
					setTileGraphic(getTile('player', x + 2, y), 9, 3);
					break;
				case 'right':
					setTileGraphic(getTile('player', x, y),     5, 6);
					setTileGraphic(getTile('player', x + 1, y), 6, 6);
					setTileGraphic(getTile('player', x + 2, y), 7, 6);
					break;
			}
			break;
		case 'submarine':
			switch (shipDirection) {
				case 'up':
					setTileGraphic(getTile('player', x, y),     2, 7);
					setTileGraphic(getTile('player', x, y + 1), 2, 8);
					setTileGraphic(getTile('player', x, y + 2), 2, 9);
					break;
				case 'down':
					setTileGraphic(getTile('player', x, y),     2, 0);
					setTileGraphic(getTile('player', x, y + 1), 2, 1);
					setTileGraphic(getTile('player', x, y + 2), 2, 2);
					break;
				case 'left':
					setTileGraphic(getTile('player', x, y),     7, 2);
					setTileGraphic(getTile('player', x + 1, y), 8, 2);
					setTileGraphic(getTile('player', x + 2, y), 9, 2);
					break;
				case 'right':
					setTileGraphic(getTile('player', x, y),     5, 7);
					setTileGraphic(getTile('player', x + 1, y), 6, 7);
					setTileGraphic(getTile('player', x + 2, y), 7, 7);
					break;
			}
			break;
		case 'battleship':
			switch (shipDirection) {
				case 'up':
					setTileGraphic(getTile('player', x, y),     3, 6);
					setTileGraphic(getTile('player', x, y + 1), 3, 7);
					setTileGraphic(getTile('player', x, y + 2), 3, 8);
					setTileGraphic(getTile('player', x, y + 3), 3, 9);
					break;
				case 'down':
					setTileGraphic(getTile('player', x, y),     3, 0);
					setTileGraphic(getTile('player', x, y + 1), 3, 1);
					setTileGraphic(getTile('player', x, y + 2), 3, 2);
					setTileGraphic(getTile('player', x, y + 3), 3, 3);
					break;
				case 'left':
					setTileGraphic(getTile('player', x, y),     6, 1);
					setTileGraphic(getTile('player', x + 1, y), 7, 1);
					setTileGraphic(getTile('player', x + 2, y), 8, 1);
					setTileGraphic(getTile('player', x + 3, y), 9, 1);
					break;
				case 'right':
					setTileGraphic(getTile('player', x, y),     5, 8);
					setTileGraphic(getTile('player', x + 1, y), 6, 8);
					setTileGraphic(getTile('player', x + 2, y), 7, 8);
					setTileGraphic(getTile('player', x + 3, y), 8, 8);
					break;
			}
			break;
		case 'carrier':
			switch (shipDirection) {
				case 'up':
					setTileGraphic(getTile('player', x, y),     4, 5);
					setTileGraphic(getTile('player', x, y + 1), 4, 6);
					setTileGraphic(getTile('player', x, y + 2), 4, 7);
					setTileGraphic(getTile('player', x, y + 3), 4, 8);
					setTileGraphic(getTile('player', x, y + 4), 4, 9);
					break;
				case 'down':
					setTileGraphic(getTile('player', x, y),     4, 0);
					setTileGraphic(getTile('player', x, y + 1), 4, 1);
					setTileGraphic(getTile('player', x, y + 2), 4, 2);
					setTileGraphic(getTile('player', x, y + 3), 4, 3);
					setTileGraphic(getTile('player', x, y + 4), 4, 4);
					break;
				case 'left':
					setTileGraphic(getTile('player', x, y),     5, 0);
					setTileGraphic(getTile('player', x + 1, y), 6, 0);
					setTileGraphic(getTile('player', x + 2, y), 7, 0);
					setTileGraphic(getTile('player', x + 3, y), 8, 0);
					setTileGraphic(getTile('player', x + 4, y), 9, 0);
					break;
				case 'right':
					setTileGraphic(getTile('player', x, y),     5, 9);
					setTileGraphic(getTile('player', x + 1, y), 6, 9);
					setTileGraphic(getTile('player', x + 2, y), 7, 9);
					setTileGraphic(getTile('player', x + 3, y), 8, 9);
					setTileGraphic(getTile('player', x + 4, y), 9, 9);
					break;
			}
			break;
	}
	for (let ship of document.querySelectorAll('.shp-game-board__tile[data-x="' + x + '"][data-y="' + y + '"] .shp-ship')) {
		ship.parentNode.removeChild(ship);
	}
}

function createExplosion(x, y) {
	let scrollbox = document.getElementsByClassName('shp-game__scrollbox')[0];
	let explosion = document.createElement('div');
	explosion.className = 'shp-game-explosion';
	explosion.style.top = 144 + y * 32 + 'px';
	explosion.style.left = 144 + x * 32 + 'px';
	scrollbox.appendChild(explosion);
	window.setTimeout(() => {
		scrollbox.removeChild(explosion);
	}, 3000);
}

function resetShip(ship) {
	ship.parentNode.classList.add('draggable-dropzone--active');
	ship.parentNode.classList.remove('draggable-dropzone--occupied');
	ship.parentNode.removeChild(ship);
	document.getElementsByClassName('shp-game-ship-case')[0].appendChild(ship);
}

if (document.getElementsByClassName('shp-game').length > 0) {
	const socket = io(window.location.pathname);
	let html = document.getElementsByClassName('shp-game')[0];

	socket.on('game full', () => {
		setStatus("This game is full.");
		socket.disconnect();
	});
	socket.on('game close', () => {
		setStatus("This game has been closed.");
		socket.disconnect();
	});
	
	socket.on('ship place', (shipData) => {
		placeShip(shipData);
	});
	socket.on('ship error', (shipData) => {
		for (let ship of document.querySelectorAll('.shp-game-board__tile[data-x="' + shipData.x + '"][data-y="' + shipData.y + '"] .shp-ship')) {
			resetShip(ship);
		}
	});
	
	let targetingInput = document.getElementById('shp-game-targeting__input');
	targetingInput.addEventListener('click', (e) => {
		targetingInput.focus();
	});
	let fireButton = document.getElementsByClassName('shp-game-targeting__fire-button')[0];
	fireButton.addEventListener('click', (e) => {
		socket.emit('fire', targetingInput.value);
		targetingInput.disabled = true;
		fireButton.disabled = true;
	});
	
	socket.on('player turn', () => {
		html.classList.remove('shp-game--opponent-turn');
		html.classList.add('shp-game--player-turn');
		setStatus("Aim your cannons.");
		targetingInput.value = '';
		targetingInput.disabled = false;
		targetingInput.focus();
		fireButton.disabled = false;
	});
	socket.on('opponent turn', () => {
		html.classList.remove('shp-game--player-turn');
		html.classList.add('shp-game--opponent-turn');
		setStatus("Opponent is aiming...");
	});
	
	socket.on('hit', (data) => {
		setTileGraphic(getTile(data.board, data.x, data.y), 0, 4);
		setStatus("Hit.");
		createExplosion(data.x, data.y);
	});
	socket.on('miss', (data) => {
		setTileGraphic(getTile(data.board, data.x, data.y), 1, 4);
		setStatus("Miss.");
		createExplosion(data.x, data.y);
	});
	socket.on('target invalid', () => {
		setStatus("Invalid target tile.");
		createExplosion(-2, -2);
	});
	socket.on('sunk', (shipData) => {
		setStatus("Sank a " + (shipData.type == 'patrolBoat' ? "patrol boat" : shipData.type) + ".");
	});
	socket.on('win', () => {
		setStatus("You win!");
	});
	socket.on('loss', () => {
		setStatus("You lose!");
	});


	let boardWidth = parseInt(document.getElementsByClassName('shp-game-board')[0].getAttribute('data-width'), 10);
	let boardHeight = parseInt(document.getElementsByClassName('shp-game-board')[0].getAttribute('data-height'), 10);
	
	let draggable = new Draggable.Droppable(document.querySelectorAll('.shp-game-ship-case, .shp-game-board__tile'), {
		draggable: '.shp-ship',
		dropzone: '.shp-game-ship-case, .shp-game-board__tile',
		delay: 0,
		plugins: [ Draggable.Plugins.Snappable ]
	});
	
	setStatus("Place your battleships.");
	socket.on('player ready', () => {
		setStatus("Waiting for opponent...");
	});
	
	document.addEventListener('keydown', (e) => {
		if (e.repeat || draggable.isDragging()) return;
		if (e.key == 'r' || e.key == 'R') {
			rotateShips();
		}
	}, true);
	document.getElementsByClassName('shp-game-ship-case__rotate-button')[0].addEventListener('click', (e) => {
		if (draggable.isDragging()) return;
		rotateShips();
	});
	
	let placedTile = null;
	let placedShip = null;
	draggable.on('droppable:dropped', (e) => {
		if (e.dropzone.classList.contains('shp-game-board__tile')) {
			let tile = e.dropzone;
			let ship = e.dragEvent.source;
			
			let shipLength;
			/**/ if (ship.classList.contains('shp-ship--patrolBoat')) shipLength = 2;
			else if (ship.classList.contains('shp-ship--destroyer'))  shipLength = 3;
			else if (ship.classList.contains('shp-ship--submarine'))  shipLength = 3;
			else if (ship.classList.contains('shp-ship--battleship')) shipLength = 4;
			else if (ship.classList.contains('shp-ship--carrier'))    shipLength = 5;
			let vertical = false;
			/**/ if (ship.classList.contains('shp-ship--facing-up'))   vertical = true;
			else if (ship.classList.contains('shp-ship--facing-down')) vertical = true;
			
			let tileX = parseInt(tile.getAttribute('data-x'), 10);
			let tileY = parseInt(tile.getAttribute('data-y'), 10);
			
			placedTile = { element: tile, x: tileX, y: tileY };
			placedShip = { element: ship };
			
			/**/ if (!vertical && tileX > boardWidth  - shipLength) e.cancel();
			else if ( vertical && tileY > boardHeight - shipLength) e.cancel();
			
			for (let distance = 0; distance < shipLength && !e.canceled(); distance++) {
				if (!vertical) {
					if (!getTile('player', tileX + distance, tileY).classList.contains('shp-game-board__tile--0-5')) e.cancel();
				} else {
					if (!getTile('player', tileX, tileY + distance).classList.contains('shp-game-board__tile--0-5')) e.cancel();
				}
			}
			
			if (e.canceled()) {
				resetShip(ship);
				placedTile = null;
				placedShip = null;
			}
		}
	});
	draggable.on('droppable:returned', (e) => {
		console.log(e);
		placedTile = null;
		placedShip = null;
	});
	draggable.on('drag:stop', (e) => {
		if (placedTile != null && placedShip != null) {
			let tile = placedTile.element;
			let ship = placedShip.element;
			
			let x = placedTile.x, y = placedTile.y;
			
			let shipType;
			/**/ if (ship.classList.contains('shp-ship--patrolBoat')) shipType = 'patrolBoat';
			else if (ship.classList.contains('shp-ship--destroyer'))  shipType = 'destroyer';
			else if (ship.classList.contains('shp-ship--submarine'))  shipType = 'submarine';
			else if (ship.classList.contains('shp-ship--battleship')) shipType = 'battleship';
			else if (ship.classList.contains('shp-ship--carrier'))    shipType = 'carrier';
			
			let shipDirection;
			/**/ if (ship.classList.contains('shp-ship--facing-up'))    shipDirection = 'up';
			else if (ship.classList.contains('shp-ship--facing-down'))  shipDirection = 'down';
			else if (ship.classList.contains('shp-ship--facing-left'))  shipDirection = 'left';
			else if (ship.classList.contains('shp-ship--facing-right')) shipDirection = 'right';
			
			socket.emit('ship place', { x: x, y: y, type: shipType, direction: shipDirection });
		}
	});
}
