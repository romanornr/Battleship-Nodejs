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
 * @return true
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

var Title = function (posX, posY, height, width, id) {
    this.pos = {x: posX, y: posY};
    this.height = height;
    this.width = width;
    this.id = id;

    this.clicked = false;

    this.elem = document.createElement("div");
    this.elem.className = "title";
    this.elem.id = id;
    this.elem.style.width = (this.width - 4) + "px";
    this.elem.style.height = (this.height - 4) + "px";

    this.elem.addEventListener("click", function () {
        placeShip(this, {x: posX, y: posY});
    });

    this.elem.addEventListener("mouseover", function () {
        previewShip(this, {x: posX, y: posY});
    });

    this.elem.addEventListener("mouseout", resetPreviews);

    this.draw = function (parent) {
        parent.appendChild(this.elem);
    };
};

var Grid = function (height, width, titleX, titleY) {
    this.titleWidth = width / titleX;
    this.titleHeight = height / titleY;

    this.container = document.createElement("div");
    this.container.id = "grid";
    this.container.style.width = width + "px";
    this.container.style.height = height + "px";

    this.draw = function () {
        document.body.appendChild(this.container);

        var id = 0;
        for (var y = 0; y < titleY; y++) {
            for (var x = 0; x < titleX; x++) {
                var title = new Title(x, y, this.titleHeight, this.titleWidth, id);
                title.draw(this.container);
                id++;
            }
        }
    };

    this.removeFromDOM = function () {
        document.removeChild(this.container);

    }
};

//Called by cick event for a title
var placeShip = function (title, pos) {
    if(maxAmountOfType()){
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

            gameWorld.ships.push(ship);

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
            }
            break;
        case 1:
            if (shipOutOFWorld(pos)) {
                break;
            }

            gameWorld.ships.push(ship);

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
            }
            break;
    }

};

//Called by mouseover event for a title
var previewShip = function (title, pos) {
    if(maxAmountOfType()){
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

//Called by mouseout event for a title
var resetPreviews = function () {
    for (var i = 0; i < gameWorld.previewTites.length; i++) {
        var elem = document.getElementById(gameWorld.previewTites[i]);
        elem.style.backgroundColor = "red";
    }
    gameWorld.previewTites = [];
};

//called by a click event on a button
var setShipType = function (type) {
    gameWorld.seletedShipType = Const.availableShips[type];
};

//sets the ship rotation. called by a button
var setShipRotation = function (rotation) {
    gameWorld.selectedShipRotation = rotation;
};

//checks if a array of titles are already taken
var titleTaken = function (titles) {
    var taken = false;
    for (i = 0; i < gameWorld.seletedShipType.size; i++) {
        if (gameWorld.shipTitels.indexOf(titles[i]) != -1) {
            taken = true;
        }
    }
    return taken;
};

//check if a ship is out the world
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

//checks if the max amount of a ship is violated
var maxAmountOfType = function () {
    var amount = 0;
    for(var i = 0; i <gameWorld.ships.length; i++){
        if(gameWorld.ships[i].type.type == gameWorld.seletedShipType.type){
            amount++;
        }
    }

    return amount >= gameWorld.seletedShipType.max;
};

gameWorld.grid = new Grid(960, 960, 15, 15);
gameWorld.grid.draw();

