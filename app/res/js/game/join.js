/// ShipShape  >  res  >  js  >  game  >  new
///		 Controls the join game page on the client side.

{// Handle the input of the game ID.
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
	
	let inputElem = document.getElementById('shp-game-join__game-id-input');
	if (inputElem) setInputFilter(inputElem, /^([0-9A-F]{0,4}?|[0-9A-F]{4}-[0-9A-F]{0,4})$/i);
}
