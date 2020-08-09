/// ShipShape  >  res  >  js  >  maps  >  new
///		 Controls the map editor on the client side.

let tooltip = document.getElementById("shp-map-editor__targeting-tooltip");
let tooltipEditbox = document.getElementById("shp-map-editor__tooltip-editbox");

function deselectTile(e) {
    let selectedTile = document.getElementById("shp-map-editor__tile--selected");
    if (e && e.target && e.target == selectedTile) {
        return;
    }
    if (selectedTile) {
        selectedTile.id = "";
    }
    tooltip.classList.remove("shp-tooltip--visible");
}

function selectTile(tile) {
    deselectTile();
    tile.id = "shp-map-editor__tile--selected";
    tooltip.classList.add("shp-tooltip--visible");
    tooltip.style.left = (tile.offsetLeft + 16) + "px";
    tooltip.style.top = (tile.offsetTop + 32) + "px";
    tooltipEditbox.focus();
}

function selectTileEventListener(e) {
    selectTile(this);
    e.stopImmediatePropagation();
}

function updateTileEventListeners() {
    let tiles = document.getElementsByClassName("shp-map-editor__tile");
    for (let tile of tiles) {
        //tile.addEventListener("click", selectTileEventListener);
        tile.addEventListener("focus", selectTileEventListener);
    }
    let headerEditboxes = document.querySelectorAll(".shp-game-board__column-header .shp-editbox, .shp-game-board__row-header .shp-editbox");
    for (let editbox of headerEditboxes) {
        editbox.addEventListener("focus", deselectTile);
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
    })
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
                row.insertAdjacentHTML("beforeend", "<td class='shp-game-board__tile shp-game-board__tile--0-5 shp-map-editor__tile' data-x='" + currentWidth + "' data-y='" + (index - 1) + "'></td>");
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
            row.insertAdjacentHTML("beforeend", "<td class='shp-game-board__tile shp-game-board__tile--0-5 shp-map-editor__tile' data-x='" + index + "' data-y='" + currentHeight + "'></td>");
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
