/*
HOW TO USE:
first declare a global var scene = null


Event: socket onConnect:  <<<if a player connects, he needs to send an array with the ships he has played

if(scene == null){
    var fleet = new Fleet(ships) <- need an array of ships that the player has placed.
    var player1 = new player(socket.id, fleet);
    scene = new Scene(player1);
} else {
    var fleet = new Fleet(ships) <- needs the array of ships form the client
    var player2 = new player(socket.id, fleet);
    scene.join(player2);
}
write the return data form the function to the client.


Event: socket onFire: <<<if a player fires, he need to send the pos on grid.

scene.handleShots(socket.id, shotPos) <-shotPos needs to recice form the client.
write the return data to the client.

The handleShots method does only someyhing is it's the turn of the player who is firing.
The handleShots return one of the folowing things:
+ You have won!                     <- Means the shot has sunk the last enemy ship
+ You have sunk a ship              <- Means your shot has sunk a ship, but not the last one
+ You have hit a ship               <- Means you have hit a ship, but you didn't sink it
+ You missed                        <- Means you missed your shot.

Event: socket onDisconnect:

var remainingPlayer;
if (scene.player1.id == socket.id) {
    remainingPlayer = scene.player1;
} else {
    remainingPlayer = scene.player2;
}

scene = null

write an explaning message to the remaining player.



And we are ready for the next 2 new players :)

*/




/**
 * makes a scene
 * @param player
 */
function Scene(player) {
    this.player1 = player;
    this.turn = 1;
}

/**
 * alows a second player to join the scene
 * @param player
 * @returns {string}
 */
Scene.prototype.join = function (player) {
    if (!this.player2 == undefined) {
        return 'room is full';
    }
    this.player2 = player;
};

/**
 * Handles all the incomming shots
 * @param socketId
 * @param shotPos
 * @returns {*}
 */
Scene.handleShots = function(socketId, shotPos){
    if(this.player1.id == socketId){
        if(this.turn == 1){
            this.turn = 2;
            return this.player1.fleet.getFiredOn(shotPos);
        }
    }
    if(this.turn == 2) {
        this.turn = 1;
        return this.player2.fleet.getFiredOn(shotPos);
    }
};

/**
 * makes a player
 * @param id
 * @param fleet
 */
function Player(id, fleet) {
    this.id = id;
    this.fleet = fleet;
}

/**
 * makes a fleet
 * @param ships :array of ship
 */
function Fleet(ships) {
    this.ships = ships;
}

/**
 * processes the incomming shots. Returns the result of the shot
 * @param shotPos
 * @returns {*}
 */
Fleet.prototype.getFiredOn = function (shotPos) {
    for(var i in this.ships){
        var ship = this.ships[i];

        if(ship.isHit(shotPos)){
            if(this.isSunk()){
                return 'You have won!';
            }
            if(ship.isRekt()){
                return 'You have sunk a ship';
            }
            return 'You have hit a ship';
        }

        return 'You missed'
    }
};

/**
 * checks if the entire fleet is sunk
 * @returns {boolean}
 */
Fleet.prototype.isSunk = function(){
    for(var i in this.ships){
        var ship = this.ships[i];

        if(!ship.isRekt()){
            return false;
        }
    }
    return true;
};

/**
 * makes a ship
 * @param type
 * @param pos
 * @param lenght
 * @param rotation :1 = verical, 2 = horizontal
 */
function Ship(type, pos, lenght, rotation) {
    this.type = type;
    this.pos = pos;
    this.length = lenght;
    this.rotation = rotation;
    this.poss = [];
    this.hits = 0;

    switch (this.rotation) {
        case 1:
            for (var i = 0; i < this.length; i++) {
                this.poss.push(new pos(this.pos.x, this.pos.y + i));
            }
            break;
        case 2:
            for (var i = 0; i < this.length; i++) {
                this.poss.push(new pos(this.pos.x + i, this.pos.y));
            }
            break;
    }
}

/**
 * checks if a ship is hit
 * @param shotPos
 * @returns {boolean}
 */
Ship.prototype.isHit = function (shotPos) {
    for (var i in this.poss) {
        var pos = this.poss[i];
        if (pos.x == shotPos.x && pos.y == shotPos.y)
            this.hits++;
        return true;
    }
    return false;
};

/**
 * checks if a ship is sunk;
 * @returns {boolean}
 */
Ship.prototype.isRekt = function(){
    return this.length == this.hits;
};

/**
 * makes a position object
 * @param x
 * @param y
 */
function Pos(x, y) {
    this.x = x;
    this.y = y
}

/**
 * returns the pos as a string
 * @returns {string}
 */
Pos.prototype.toString = function(){
    return 'x: ' + this.x + ' y: ' + this.y;
};