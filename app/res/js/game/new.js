/// ShipShape  >  res  >  js  >  game  >  new
///     Controls the new game page on the client side.

let cancelButton = document.getElementById('shp-game-new__cancel-button');
if (cancelButton != null) {
	cancelButton.addEventListener('click', () => {
		window.history.back();
	});
}

let multiplayerModeSelectElem = document.getElementById('shp-game-new__multiplayer-mode-select');
let multiplayerModeSelect = M.FormSelect.init(multiplayerModeSelectElem);
