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
	];

var updateShip = function(id, ship, callback){

	var player;

	for (var i = 0; i< players.length; i++) {
		if(players[i].id == id) player = players[i];
	}

	for (var i = 0; i< player.ships.length; i++) {
		if (player.ships[i].type == ship.type) {
				player.ships[i] = ship;
			console.log('ship placed at coordination '+ ship.location)
		}
	}
};


io.on('connection', function(socket){
var id = socket.id;

if (players.length >= 2){
	socket.emit('RoomIsFull', true);
	console.log('Room is ful');
	return;
}

socket.on('place', function(ship){
	updateShip(socket.id, ship, function(){

	});
});

//create player & push to players array with starting data
players.push({'id' : socket.id, 'ready': true, 'takenHits': 0, 'ships': ships});

socket.on('init', function(player){
	var player;
		for (var i = players.length - 1; i >= 0; i--) {
		if(players[i].id == id) player = players[i]
}

//init with if statement to force the correct id
	if (id == socket.id) socket.emit('init', player);
	console.log(id + 'is ready to play');
});

if(players.length > 1){
	socket.emit('enemyIsFound', 'enemyIsFound');
	socket.broadcast.emit('enemyIsFound', 'enemyIsFound');
};


socket.on('fire', function(obj, id, ship){

	var enemy = [];
	// //define enemy
	 players.map(function(player){if(player.id != socket.id) return enemy = player});

	/**
	 * check if fired shot matches any ship location
	 * @boolean {[true]}
	 */
	 var hit = enemy.ships
  			.map(ship => ship.location)
  			.some(coordinates => coordinates.some(coordinate => coordinate === obj.coordination ));

	if(hit){
		enemy.takenHits++;
		console.log('Hit! '+obj.coordination);
		socket.emit('hit', {'coordination' : obj.coordination, 'hit' : hit});

		}else{
			console.log('missed');
			console.log(obj.coordination);
		};
});

	socket.on('disconnect', function(){
		console.log(id +" player left")
		for (var i = 0; i < players.length; i++) {
			 var currentPlayer = players[i]
			 if(currentPlayer.id == id) players.splice(i, 1);
		}
			console.log('a Player disconnect '+ players.length);
	}); 
});

//let it listen on port
http.listen(1337, function()
{
	console.log('listening on port 1337');
});