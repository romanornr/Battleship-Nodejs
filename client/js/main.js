/**
 * Created by Wim on 11-3-2016.
 */

var Const = {}, gameWorld = {};

gameWorld.grid = {};
gameWorld.ships = [];
gameWorld.shipTitels = [];
gameWorld.previewTites = [];
gameWorld.selectedShipSize = 2;


Const.availableShips = ['carrier','battleship', 'destroyer', 'submarine','patrolboat'];
Const.player1 = 0;
Const.player2 = 1;

Const.empty = 0; //water
Const.ship = 1; //boat	
Const.miss = 2; //shot missed
Const.hit = 3;  //boat got hit
Const.rekt = 4; //sunk ship

/**
 * Game statistics to show
 * How many hits 
 * How many times player got hit
 * How many games got played
 * how many games got won
 * getting unique id or create one
 */
function Statistics()
{
	this.taken = 0;
	this.hits = 0;

	this.totalTaken = parseInt(localStorage.getItem('totalTaken'), 1) || 0;
	this.totalHits = parseInt(localStorage.getItem(totalHits), 1) || 0;
	this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed'), 1) || 0;
	this.gamesWon = parseInt(localStorage.getItem('gamesWon'), 1) || 0;
	this.uuid = localStorage.getItem('uuid') || this.createuuid();
}

Statistics.prototype.incrementHits = function()
{
	this.hits++;
};

Statistics.prototype.incrementTaken = function()
{
	this.taken++;
};

Statistics.prototype.wonGame = function()
{
	this.gamesPlayed++;
	this.gamesWon++;
};

Statistics.prototype.lostGame = function()
{
	this.gamesPlayed++;
};

/**
 * Define ship objects
 * constructor
 * @param Ship type
 */
function Ship(type)
{
	this.type = type;
	this.damage = 0;

	switch(this.type)
	{
		case Const.availableShips[0]:
			this.shipLenght = 5;
			break;
		case Const.availableShips[1]:
			this.shipLenght = 4;
            break;
		case Const.availableShips[2]:
			this.shipLenght = 3;
            break;
		case Const.availableShips[3]:
			this.shipLenght = 2;
            break;
		default:
			this.shipLenght = 3;
			break;
	}
	this.maxDamage = this.shipLenght;
	this.rekt = false;
}

/**
 * Increment damage the ship
 * @return true
 */
Ship.prototype.incrementDamage = function()
{
	this.damage++;
	if(this.isRekt())
	{
		this.rektShip()
	}
};

/**
 * Check to see if ship is rekt/sunk
 * @return {Boolean}
 */
Ship.prototype.isRekt = function()
{
	return this.damage >= this.maxDamage;
};

/**
 * make the ship sink
 * @return {Boolean} [returns true]
 */
Ship.prototype.rektShip = function()
{
	this.damage = this.maxDamage;
	this.rekt = true;
};

var Title = function (posX, posY, height, width, id) {
    this.clicked = false;

    this.elem = document.createElement("div");
    this.elem.className = "title";
    this.elem.id = id;
    this.elem.style.width = (width - 4) + "px";
    this.elem.style.height = (height - 4) + "px";

    this.elem.addEventListener("click", function () {
        placeShip(this);
    });

    this.elem.addEventListener("mouseover", function () {
        previewShip(this);
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
};

var placeShip = function (title) {
    gameWorld.previewTites = [];
    var titles = [];

    for (var i = 0; i < gameWorld.selectedShipSize; i++) {
        titles.push(Number(title.id) + i * 15);
    }

    var taken = titleTaken(titles);

    if(!taken) {
        for (i = 0; i < gameWorld.selectedShipSize; i++) {
            titleElem = document.getElementById(titles[i]);
            titleElem.style.backgroundColor = "blue";

            gameWorld.shipTitels.push(titles[i]);
        }
    }
};

var previewShip = function (title) {
    var previewTitles = [];

    for (var i = 0; i < gameWorld.selectedShipSize; i++) {
        previewTitles.push(Number(title.id) + i * 15);
    }

    var taken = titleTaken(previewTitles);

    if (!taken) {
        for (i = 0; i < gameWorld.selectedShipSize; i++) {
            var id = Number(title.id) + i * 15;

            titleElem = document.getElementById(id);
            titleElem.style.backgroundColor = "lightblue";

            gameWorld.previewTites.push(id);
        }
    }
};

var titleTaken = function(titles){
    var taken = false;
    for (i = 0; i < gameWorld.selectedShipSize; i++) {
        if (gameWorld.shipTitels.indexOf(titles[i]) != -1) {
            taken = true;
        }
    }
    return taken;
};

var resetPreviews = function () {
    for (var i = 0; i < gameWorld.previewTites.length; i++) {
        var elem = document.getElementById(gameWorld.previewTites[i]);
        elem.style.backgroundColor = "red";
    }
    gameWorld.previewTites = [];
};

var setShipSize = function (size) {
    gameWorld.selectedShipSize = size;
};

gameWorld.grid = new Grid(960, 960, 15, 15);
gameWorld.grid.draw();

