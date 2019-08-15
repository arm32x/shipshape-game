/// ShipShape  >  res  >  js  >  game  >  new
///		 Controls the new game page on the client side.

let cancelButton = document.getElementById('shp-game-new__cancel-button');
if (cancelButton != null) {
	cancelButton.addEventListener('click', () => {
		window.history.back();
	});
}

let multiplayerMode = undefined;
{// Handle the selection of multiplayer modes.
	let selectElem = document.getElementById('shp-game-new__multiplayer-mode-select');
	let select = M.FormSelect.init(selectElem);

	let descriptions = document.getElementsByClassName('shp-game-new__multiplayer-mode-description');
	function update(e) {
		multiplayerMode = e.target.value;
		for (let description of descriptions) {
			description.style.display = 'none';
			if (description.getAttribute('data-multiplayer-mode') == multiplayerMode) {
				description.style.display = 'block';
			}
		}
	}
	update({ target: selectElem.querySelector('[selected]') });
	selectElem.addEventListener('change', update);
}

{// Handle the input of the map ID.
	// Restricts input for the given textbox to the given regex inputFilter.
	function setInputFilter(textbox, inputFilter) {
	 	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
			textbox.addEventListener(event, function() {
				if (inputFilter.test(this.value)) {
					if (this.value.length == 4) {
						if (this.oldValue.length == 3) {
							this.value += '-';
						} else if (this.oldValue.length == 5) {
							this.value = this.value.substring(0, 3);
						}
					}
					this.oldValue = this.value;
					this.oldSelectionStart = this.selectionStart;
					this.oldSelectionEnd = this.selectionEnd;
				} else if (this.hasOwnProperty("oldValue")) {
					this.value = this.oldValue;
					this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
				}
			});
		});
	}
	
	let inputElem = document.getElementById('shp-game-new__map-id-input');
	setInputFilter(inputElem, /^([0-9A-F]{0,4}?|[0-9A-F]{4}-[0-9A-F]{0,4})$/i);
}
