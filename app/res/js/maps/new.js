/// ShipShape  >  res  >  js  >  maps  >  new
///		 Controls the map editor on the client side.

let tooltip = document.getElementById("shp-map-editor__targeting-tooltip");
let tooltipEditbox = document.getElementById("shp-map-editor__tooltip-editbox");
let selectedTile = null;

function deselectTile(e) {
    let tile = document.getElementById("shp-map-editor__tile--selected");
    if (e && e.target && e.target == tile) {
        return;
    }
    if (tile) {
        tile.id = "";
        selectedTile = null;
    }
    tooltip.classList.remove("shp-tooltip--visible");
}

function selectTile(tile) {
    deselectTile();
    tile.id = "shp-map-editor__tile--selected";
    selectedTile = tile;

    tooltip.classList.add("shp-tooltip--visible");
    tooltip.style.left = (tile.offsetLeft + 16) + "px";
    tooltip.style.top = (tile.offsetTop + 32) + "px";

    if (tile.hasAttribute("data-targeting")) {
        tooltipEditbox.textContent = tile.getAttribute("data-targeting");
    } else {
        tooltipEditbox.textContent = "";
    }
}

function selectTileEventListener(e) {
    selectTile(this);
    e.stopImmediatePropagation();
}

let hotkeys = {
    tile(e) {
        // TODO:  Bind arrow keys/wasd/hjkl to select different tiles.
        if (e.code == "Enter") {
            tooltipEditbox.focus();
            e.preventDefault();
        }
    },
    tooltipEditbox(e) {
        if (e.code == "Enter") {
            selectedTile.focus();
            e.preventDefault();
        } else if (e.code == "Tab") {
            // TODO:  Select either the next or previous tile based on Shift.
            e.preventDefault();
        }
    },
    headerEditbox(e) {
        if (e.code == "Enter") {
            e.preventDefault();
        }
    }
};

function tileHotkeyEventListener(e) {
}

function headerEditboxHotkeyEventListener(e) {
}

function updateTileEventListeners() {
    let tiles = document.getElementsByClassName("shp-map-editor__tile");
    for (let tile of tiles) {
        //tile.addEventListener("click", selectTileEventListener);
        tile.addEventListener("focus", selectTileEventListener);
        tile.addEventListener("keydown", hotkeys.tile);
    }
    let headerEditboxes = document.querySelectorAll(".shp-game-board__column-header .shp-editbox, .shp-game-board__row-header .shp-editbox");
    for (let editbox of headerEditboxes) {
        editbox.addEventListener("focus", deselectTile);
        editbox.addEventListener("keydown", hotkeys.headerEditbox);
    }
    let resizeButtons = document.getElementsByClassName("shp-map-editor__resize-button");
    for (let button of resizeButtons) {
        button.addEventListener("focus", deselectTile);
    }
}

updateTileEventListeners();
// Detect if we are on the map editor page.
if (document.getElementsByClassName("shp-map-editor").length > 0) {
    document.addEventListener("click", deselectTile);
    tooltip.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    tooltipEditbox.addEventListener("input", (e) => {
        if (selectedTile) {
            selectedTile.setAttribute("data-targeting", tooltipEditbox.textContent);
        }
    });
    tooltipEditbox.addEventListener("keydown", hotkeys.tooltipEditbox);
}

let addColumnButton = document.getElementById("shp-map-editor__add-column-button");
if (addColumnButton) {
    addColumnButton.addEventListener("click", (e) => {
        let gameBoard = document.getElementsByClassName("shp-map-editor__board")[0];
        let boardBody = gameBoard.getElementsByTagName("tbody")[0];
        let currentWidth = boardBody.children[1].children.length - 1;

        for (let [ index, row ] of Array.from(boardBody.children).entries()) {
            if (index == 0) {
                row.insertAdjacentHTML('beforeend', "<th class='shp-game-board__column-header'><div><span contenteditable class='shp-map-editor__editbox'>Column " + (currentWidth + 1) + "</span></div></th>");
            } else {
                row.insertAdjacentHTML("beforeend", "<td class='shp-game-board__tile shp-game-board__tile--0-5 shp-map-editor__tile' data-x='" + currentWidth + "' data-y='" + (index - 1) + "' tabindex='0'></td>");
            }
        }
        updateTileEventListeners();
    });
}

let removeColumnButton = document.getElementById("shp-map-editor__remove-column-button");
if (removeColumnButton) {
    removeColumnButton.addEventListener("click", (e) => {
        let gameBoard = document.getElementsByClassName("shp-map-editor__board")[0];
        let boardBody = gameBoard.getElementsByTagName("tbody")[0];
        for (let row of boardBody.children) {
            // There must be at least one column in a map (two including the headers).
            if (row.children.length > 2) {
                let lastCell = row.lastElementChild;
                row.removeChild(lastCell);
            }
        };
    });
}

let addRowButton = document.getElementById("shp-map-editor__add-row-button");
if (addRowButton) {
    addRowButton.addEventListener("click", (e) => {
        let gameBoard = document.getElementsByClassName("shp-map-editor__board")[0];
        let boardBody = gameBoard.getElementsByTagName("tbody")[0];
        let currentWidth = boardBody.children[1].children.length - 1;
        let currentHeight = boardBody.children.length - 1;

        let row = document.createElement("tr");
        row.innerHTML = "<th class='shp-game-board__row-header'><div><span contenteditable class='shp-map-editor__editbox'>Row " + (currentHeight + 1) + "</span></div></th>";

        for (let index = 0; index < currentWidth; index++) {
            row.insertAdjacentHTML("beforeend", "<td class='shp-game-board__tile shp-game-board__tile--0-5 shp-map-editor__tile' data-x='" + index + "' data-y='" + currentHeight + "' tabindex='0'></td>");
        }

        boardBody.appendChild(row);
        updateTileEventListeners();
    });
}

let removeRowButton = document.getElementById("shp-map-editor__remove-row-button");
if (removeRowButton) {
    removeRowButton.addEventListener("click", (e) => {
        let gameBoard = document.getElementsByClassName("shp-map-editor__board")[0];
        let boardBody = gameBoard.getElementsByTagName("tbody")[0];
        // There must be at least one row in a map (two including the headers).
        if (boardBody.children.length > 2) {
            let lastRow = boardBody.lastElementChild;
            boardBody.removeChild(lastRow);
        }
    });
}

let shipInputs = document.getElementsByClassName("shp-map-ship__input");
for (let shipInput of shipInputs) {
    for (let event of ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"]) {
        shipInput.addEventListener(event, function(e) {
            if (/^\d*$/i.test(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    }
    shipInput.addEventListener("blur", function(e) {
        if (this.value == "") {
            this.value = "0";
        } else {
            this.value = parseInt(this.value);
        }
    });
}
