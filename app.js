var DEBUG = true;
//import Express
var app = require('express')();
var express = require('express');
//create a NodeJs http server
var http = require('http').Server(app);

var io = require('socket.io')(http);
app.use(express.static(__dirname + '/vuejs'));
app.use(express.static(__dirname + '/socket.io'));

var players = [];

var ships = [
		{'type': 'Aircaft', 'size': 5, 'rekt': false, 'available': 1, 'location' : []},
		{'type': 'Battleship', 'size': 4, 'rekt': false, 'available': 2, 'location' : []},
		{'type': 'Destroyer', 'size': 3, 'rekt': false, 'available': 3, 'location' : []},
		{'type': 'Submarine', 'size': 3, 'rekt': false, 'available': 3, 'location' : []},
		{'type': 'Patrolboat', 'size': 2, 'rekt': false, 'available': 4, 'location' : []}
	]; //takes 39 hits before all ships are rekt

var updateShip = function(id, ship, callback){

	var player;

    //console.log('Ship', ship);

	for (var i = 0; i< players.length; i++) {
		if(players[i].id == id) player = players[i];
	}


	for (var i = 0; i< ships.length; i++) {
		if (ships[i].type == ship.type) {
				player.ships.push(ship);
		}
	}

    //console.log('player', player.id, 'ship', ship, 'ships', player.ships);
};

/**
 * Giving a player his turn to play.
 * socket.id  {[int]}   id   [network socketid]
 * @return {[boolean]}       [sets pemission to true]
 */
var permissionToFire = function(id, callback){
	players.map(function(enemy){if(enemy.id == id) callback(enemy.permissionToFire = true);
	});
}

io.on('connection', function(socket){
var id = socket.id;

//only 2 players allowed to play
if (players.length >= 2){ 
	socket.emit('RoomIsFull', true);
	console.log('Room is full');
	return;
}

socket.on('place', function(ship){
	updateShip(socket.id, ship, function(){
	});
});

socket.on('ready', function(){
	socket.broadcast.emit('enemyIsReady')
});

//create player & push to players array with starting data.
players.push({'id' : socket.id, 'ready': true, 'takenHits': 0, permissionToFire: false, 'ships': []});

socket.on('init', function(player){
	var player;
		for (var i = players.length - 1; i >= 0; i--) {
		if(players[i].id == id) player = players[i]
	}

//init with if statement to force the correct id.
	if (id == socket.id) socket.emit('init', player);
	console.log(id + 'is ready to play');
});

//message that 2 players are able to play
if(players.length > 1){
	socket.emit('enemyIsFound', 'enemyIsFound');
	socket.broadcast.emit('enemyIsFound', 'enemyIsFound');
	players[0].permissionToFire = true; //give the first player permission to fire.
};


socket.on('fire', function(obj, id, ship){

	var enemy = [];
	// //define enemy
	 players.map(function(player){if(player.id != socket.id) return enemy = player});
	console.log('enemy', enemy.id);

	/**
	 * check if fired shot matches any ship location.
	 * @boolean {[true]}
	 */
	 var hit = enemy.ships
  			.map(ship => ship.location)
  			.some(coordinates => coordinates.some(coordinate => coordinate === obj.coordination ));

	if(hit){
		enemy.takenHits++;
		console.log('Hit! '+ obj.coordination);
		socket.emit('hit', {'coordination' : obj.coordination, 'hit' : hit});
		if(enemy.takenHits >= 39) io.sockets.emit('win', enemy); //if all ships are hit, send win/lose message

		}else{
			console.log('missed');
			console.log(obj.coordination);
		};

		/**
		 * updating the bord of the current enemy
		 * to show where the other play hit/missed.
		 */
		socket.broadcast.emit('updateBoards', { 'coordination': obj.coordination, 'enemy':enemy});

		/**
		 * give the turn to fire to the enemy who got shot.
		 * @return {[object]}  [send enemy object]
		 */
		permissionToFire(enemy.id, function(){
				io.sockets.connected[enemy.id].emit('permissionFire', enemy);
			});
		console.log(enemy);
	});

	socket.on('disconnect', function(){
			players.map(function(player, index){if(player.id == id) players.splice(index, 1)});
			console.log(id +" player left "+ players.length);
	});
});

//let it listen on port
http.listen(1337, function()
{
	console.log('listening on port 1337');
});