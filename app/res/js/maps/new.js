/// ShipShape  >  res  >  js  >  maps  >  new
///		 Controls the map editor on the client side.

function deselectTile() {
    let selectedTile = document.getElementById("shp-map-editor__tile--selected");
    if (selectedTile) {
        selectedTile.id = "";
    }
}

function selectTile(tile) {
    deselectTile();
    tile.id = "shp-map-editor__tile--selected";
}

function selectTileEventListener(e) {
    selectTile(this);
    e.stopPropagation();
}

function updateTileEventListeners() {
    let tiles = document.getElementsByClassName("shp-map-editor__tile");
    for (let tile of tiles) {
        tile.addEventListener("focus", selectTileEventListener);
        tile.addEventListener("blur", deselectTile);
    }
}

updateTileEventListeners();

let addColumnButton = document.getElementById("shp-map-editor__add-column-button");
if (addColumnButton) {
    addColumnButton.addEventListener("click", (e) => {
        let gameBoard = document.getElementsByClassName("shp-map-editor__board")[0];
        let boardBody = gameBoard.getElementsByTagName("tbody")[0];
        let currentWidth = boardBody.children[1].children.length - 1;

        for (let [ index, row ] of Array.from(boardBody.children).entries()) {
            if (index == 0) {
                row.insertAdjacentHTML('beforeend', "<th class='shp-game-board__column-header'><div><span contenteditable='true' class='shp-editbox'>Column " + (currentWidth + 1) + "</span></div></th>");
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
        row.innerHTML = "<th class='shp-game-board__row-header'><div><span contenteditable='true' class='shp-editbox'>Row " + (currentHeight + 1) + "</span></div></th>";

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
