/// ShipShape  >  res  >  js  >  game  >  show
///		 Controls the main game on the client side.

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

if (document.getElementsByClassName('shp-game').length > 0) {
	document.addEventListener('keydown', (e) => {
		if (e.repeat) return;
		if (e.key == 'r' || e.key == 'R') {
			rotateShips();
		}
	}, true);
	
	let draggable = new Draggable.Droppable(document.querySelectorAll('.shp-game-ship-case, .shp-game-board__tile'), {
		draggable: '.shp-ship',
		dropzone: '.shp-game-ship-case, .shp-game-board__tile',
		delay: 0,
		plugins: [ Draggable.Plugins.Snappable ]
	});
	console.log(draggable);
	draggable.on('droppable:dropped', (e) => {
		console.log(e);
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
			let boardWidth = parseInt(tile.parentNode.parentNode.parentNode.getAttribute('data-width'), 10);
			let boardHeight = parseInt(tile.parentNode.parentNode.parentNode.getAttribute('data-height'), 10);
			
			console.log(tileX, tileY, boardWidth, boardHeight, shipLength);
			
			/**/ if (!vertical && tileX > boardWidth  - shipLength) e.cancel();
			else if ( vertical && tileY > boardHeight - shipLength) e.cancel();
			
			draggable.removeContainer(tile);
		}
	});
	draggable.on('drag:stop', (e) => {
		console.log(e);
	});
}
