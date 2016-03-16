/**
 * Created by Wim on 11-3-2016.
 */

const Const = {};
var gameWorld = {};

Const.availableShips = [
    {
        'type': 'carrier',
        'size': 5,
        'max': 1
    },
    {
        'type': 'battleship',
        'size': 4,
        'max': 2
    },
    {
        'type': 'destroyer',
        'size': 3,
        'max': 3
    },
    {
        'type': 'submarine',
        'size': 3,
        'max': 3
    },
    {
        'type': 'patrolboat',
        'size': 2,
        'max': 4
    }
];
Const.player1 = 0;
Const.player2 = 1;


Const.empty = 0; //water
Const.ship = 1; //boat	
Const.miss = 2; //shot missed
Const.hit = 3;  //boat got hit
Const.rekt = 4; //sunk ship

gameWorld.grid = {};
gameWorld.ships = [];
gameWorld.shipTitels = [];
gameWorld.previewTites = [];
gameWorld.seletedShipType = Const.availableShips[4];
gameWorld.selectedShipRotation = 1;
/**
 * Game statistics to show
 * How many hits
 * How many times player got hit
 * How many games got played
 * how many games got won
 * getting unique id or create one
 */
function Statistics() {
    this.taken = 0;
    this.hits = 0;

    this.totalTaken = parseInt(localStorage.getItem('totalTaken'), 1) || 0;
    this.totalHits = parseInt(localStorage.getItem(totalHits), 1) || 0;
    this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed'), 1) || 0;
    this.gamesWon = parseInt(localStorage.getItem('gamesWon'), 1) || 0;
    this.uuid = localStorage.getItem('uuid') || this.createuuid();
}

Statistics.prototype.incrementHits = function () {
    this.hits++;
};

Statistics.prototype.incrementTaken = function () {
    this.taken++;
};

Statistics.prototype.wonGame = function () {
    this.gamesPlayed++;
    this.gamesWon++;
};

Statistics.prototype.lostGame = function () {
    this.gamesPlayed++;
};

/**
 * Define ship objects
 * constructor
 * @param Ship type
 */
function Ship(type, pos) {
    this.pos = pos;
    this.type = type;
    this.damage = 0;

    this.maxDamage = this.type.size;
    this.rekt = false;
    this.used = false;
}

/**
 * Increment damage the ship
 * @return {boolean}
 */
Ship.prototype.incrementDamage = function () {
    this.damage++;
    if (this.isRekt()) {
        this.rektShip()
    }
};

/**
 * Check to see if ship is rekt/sunk
 * @return {Boolean}
 */
Ship.prototype.isRekt = function () {
    return this.damage >= this.maxDamage;
};

/**
 * make the ship sink
 * @return {Boolean} [returns true]
 */
Ship.prototype.rektShip = function () {
    this.damage = this.maxDamage;
    this.rekt = true;
};

/**
 * @param title returns title object from grid
 * @param click place the ship
 * @param mousover, gives color before placing
 * @param mousout, gives color red (cancel)
 * @param draw, draws title in the grid
 */
var Title = function (posX, posY, id) {
    this.pos = {x: posX, y: posY};
    this.id = id;

    this.clicked = false;

    this.elem = document.createElement("div");
    this.elem.className = "title";
    this.elem.id = id;
    this.elem.style.width = "28px";
    this.elem.style.height = "28px";

    this.elem.addEventListener("click", function () {
        placeShip(this, {'x': posX, 'y': posY});
    });

    this.elem.addEventListener("mouseover", function () {
        previewShip(this, {'x': posX, 'y': posY});
    });

    this.elem.addEventListener("mouseout", resetPreviews);

    this.draw = function (parent) {
        parent.appendChild(this.elem);
    };
};

/**
 * @param grid 
 * @return {object} [grid object]
 * 
 * @param draw [draws the grid in the dom]
 * @return {void}
 * @param removeFromDOM [removes ship from dom]
 */
var Grid = function () {
    this.container = document.createElement("div");
    this.container.id = "grid";

    this.draw = function () {
        document.body.appendChild(this.container);

        var id = 0;
        for (var y = 0; y < 15; y++) {
            for (var x = 0; x < 15; x++) {
                var title = new Title(x, y, id);
                title.draw(this.container);
                id++;
            }
        }
    };

    this.removeFromDOM = function () {
        document.removeChild(this.container);

    }
};

/**
 * @param  placeShip [placing ship on the board]
 * @return { void } 
 * 
 * @param  gameWorld.selectedShipRotation [rotation from ships]
 */
var placeShip = function (title, pos) {
    if (maxAmountOfType()) {
        return;
    }

    var ship = new Ship(gameWorld.seletedShipType, pos);

    gameWorld.previewTites = [];
    var titles = [];

    switch (gameWorld.selectedShipRotation) {
        case 0:
            if (shipOutOFWorld(pos)) {
                break;
            }


            for (var i = 0; i < gameWorld.seletedShipType.size; i++) {
                titles.push(Number(title.id) + i * 15);
            }

            var taken = titleTaken(titles);

            if (!taken) {
                for (i = 0; i < gameWorld.seletedShipType.size; i++) {
                    titleElem = document.getElementById(titles[i]);
                    titleElem.style.backgroundColor = "blue";

                    gameWorld.shipTitels.push(titles[i]);
                }
                gameWorld.ships.push(ship);
            }
            break;
        case 1:
            if (shipOutOFWorld(pos)) {
                break;
            }

            for (i = 0; i < gameWorld.seletedShipType.size; i++) {
                titles.push(Number(title.id) + i);
            }

            taken = titleTaken(titles);

            if (!taken) {
                for (i = 0; i < gameWorld.seletedShipType.size; i++) {
                    titleElem = document.getElementById(titles[i]);
                    titleElem.style.backgroundColor = "blue";

                    gameWorld.shipTitels.push(titles[i]);
                }
                gameWorld.ships.push(ship);
            }
            break;
    }
    enableStartButton();
};

/**
 * @param  previewShip 
 * @return { void} [shows a preview of the ship]
 */
var previewShip = function (title, pos) {
    if (maxAmountOfType()) {
        return;
    }

    var previewTitles = [];

    switch (gameWorld.selectedShipRotation) {
        case 0:
            if (shipOutOFWorld(pos)) {
                break;
            }

            for (var i = 0; i < gameWorld.seletedShipType.size; i++) {
                previewTitles.push(Number(title.id) + i * 15);
            }

            var taken = titleTaken(previewTitles);

            if (!taken) {
                for (i = 0; i < gameWorld.seletedShipType.size; i++) {
                    var id = Number(title.id) + i * 15;

                    titleElem = document.getElementById(id);
                    titleElem.style.backgroundColor = "lightblue";

                    gameWorld.previewTites.push(id);
                }
            }
            break;
        case 1:
            if (shipOutOFWorld(pos)) {
                break;
            }

            for (i = 0; i < gameWorld.seletedShipType.size; i++) {
                previewTitles.push(Number(title.id) + i);
            }

            taken = titleTaken(previewTitles);

            if (!taken) {
                for (i = 0; i < gameWorld.seletedShipType.size; i++) {
                    id = Number(title.id) + i;

                    titleElem = document.getElementById(id);
                    titleElem.style.backgroundColor = "lightblue";

                    gameWorld.previewTites.push(id);
                }
            }
            break;
    }
};

/**
 * @return {reset Previews}
 * @return { void} [reset the previews of ships]
 */
var resetPreviews = function () {
    for (var i = 0; i < gameWorld.previewTites.length; i++) {
        var elem = document.getElementById(gameWorld.previewTites[i]);
        elem.style.backgroundColor = "red";
    }
    gameWorld.previewTites = [];
};

/**
 * @param {setShipType}
 * @return { void } [set the var to a ship type]
 */
var setShipType = function (type) {
    gameWorld.seletedShipType = Const.availableShips[type];
};

//sets the ship rotation. called by a button
var setShipRotation = function (rotation) {
    gameWorld.selectedShipRotation = rotation;
};

/**
 * @param  {titleTaken}
 * @return {[boolean]} [check if the cordinate of a placing ship is taken]
 */
var titleTaken = function (titles) {
    var taken = false;
    for (i = 0; i < gameWorld.seletedShipType.size; i++) {
        if (gameWorld.shipTitels.indexOf(titles[i]) != -1) {
            taken = true;
        }
    }
    return taken;
};

/**
 * @param  {shipOutOFWorld}
 * @return {bool} [Check if the ship is without the world]
 */
var shipOutOFWorld = function (pos) {
    switch (gameWorld.selectedShipRotation) {
        case 0:
            return pos.y + gameWorld.seletedShipType.size > 15;
            break;
        case 1:
            return pos.x + gameWorld.seletedShipType.size > 15;
            break;
    }
};

/**
 * @return {maxAmountOfType}
 * @return {boolean} [check if maximum amounts of shiptype is used]
 */
var maxAmountOfType = function () {
    var amount = 0;
    for (var i = 0; i < gameWorld.ships.length; i++) {
        if (gameWorld.ships[i].type.type == gameWorld.seletedShipType.type) {
            amount++;
        }
    }

    return amount >= gameWorld.seletedShipType.max;
};

//contains the grid that shows the ships of the player. draw() creates the grid on the DOM
/**
 * @param {OwnShipGrad}
 * @return {object} [returns a grid witch contains the ships of the player]
 * @param {draw}
 * @return {void} [draws own ships on the grid]
 */
var OwnShipGrid = function (ships, shipTitles) {
    this.ships = ships;
    this.shipTitles = shipTitles;

    this.elem = document.createElement("div");
    this.elem.id = "ownShips";

    this.draw = function () {
        document.body.appendChild(this.elem);

        var id = 0;
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                var title = document.createElement("div");
                title.className = "title";
                title.style.width = "28px";
                title.style.height = "28px";

                for(var z = 0; z < shipTitles.length; z++){
                    if(id == shipTitles[z]){
                        title.style.backgroundColor = 'blue';
                    }
                }

                this.elem.appendChild(title);

                id++;
            }
        }
    };
};

//this is the grid on wich the player can shoot
/**
 * @param TargetGrid [Is the enemy grid, where a player can aim]
 * @param {draw} [Puts the grid in the DOM}
 */
var TargetGrid = function () {
    this.elem = document.createElement("div");
    this.elem.id = "shootGrid";

    this.draw = function () {
        document.body.appendChild(this.elem);

        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                var title = new TargetGridTitle(this.elem, x, y);
            }
        }
    };
};

/**
 * @param {TargetTitle}
 * @returns { object } [Target Grid]
 */
var TargetGridTitle = function(elem, x, y){
    var title = document.createElement("div");
    title.className = "title shootTitle";
    title.style.width = "28px";
    title.style.height = "28px";

    elem.appendChild(title);
    var pos = {'x': x, 'y': y};
    title.addEventListener("click", function (){ shoot(pos)});
};

/**
 * @param resetGame [refresh the page (reset)]
 */
var resetGame = function () {
    location.reload();
};

/**
 * @return { void } [initialize the targetplayer his grid]
 */
var startStageTwo = function () {
    document.body.removeChild(document.getElementById("grid"));

    gameWorld.shootedTitles = [];

    var shipTitles = gameWorld.shipTitels;
    var ships = gameWorld.ships;

    gameWorld = {};
    gameWorld.ownShipsGrid = new OwnShipGrid(ships, shipTitles);

    gameWorld.ownShipsGrid.draw();

    gameWorld.targetGrid = new TargetGrid();
    gameWorld.targetGrid.draw();

};

var shoot = function(pos, targetPlayer, targetGrid)
{
    //var targetGrid = targetGrid;
    var targetPlayer;

    // if (targetPlayer == Const.player1)
    // {
    //     targetGrid = this.player1Grid;
    //     targetShip = this.player1Ship;

    // }else if (targetPlayer == Const.player2){
    //     targetGrid = this.player2Grid;
    //     targetShip = this.player2Ship;
    // }

    if (targetGrid.isRekt(pos))
    {
        return null;

    }else if (targetGrid.isMissed(pos)){
        return null;
    }

};

var enableStartButton = function(){
    if(gameWorld.ships.length >= 13){
        document.getElementsByClassName("startButton")[0].disabled = false;
    }
};


gameWorld.grid = new Grid();
gameWorld.grid.draw();