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
var roomCapicity = 0;

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
			if (player.ships[i].location == 0) //check if the ship hasn't been placed yet.
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

if(players.length > 1){
	socket.emit('enemyIsFound', 'enemyIsFound');
	socket.broadcast.emit('enemyIsFound', 'enemyIsFound');

	socket.on('init', function(player){
	var player;
		for (var i = players.length - 1; i >= 0; i--) {
		if(players[i].id == id) player = players[i]
	}

	//init with if statement to force the correct id
	if (id == socket.id) socket.emit('init', player);
	console.log(id + 'is ready to play');
	});
};


	socket.on('fire', function(obj, id, ship){

		//var hit = false;
		var enemy = [];
		// //define enemy
	 	players.map(function(player){if(player.id != socket.id) return enemy = player});

	 	var hit;
	 	for (var i = 0; i < enemy.ships.length; i++) {
	 		for (var n = 0; n < enemy.ships[i].location.length; n++) {
	 			if (obj.coordination == enemy.ships[i].location[n]) hit = true;;
	 		}
	 	};

		// var test = enemy.ships.map(function(ship){
		// 	if(ship.location == obj.coordination){
		// 		return true;
		// 	}

		// 	return false;
		// });
		//console.log(test);
		// for (var n = 0; n < enemy.ships.length; i++) {
		// 	if(enemy.ships[n].location == obj.coordination){
		// 		console.log('hikit')
		// 	}
		// };

		// 		// for (var n = 0; i < players.length; n++) {
		// 		// 	console.log('hi');
		// 		// 	if(players.locations[n] == obj.coordination) hit = true;
		// 		// }
		// 		// if(hit) console.log(enemy.takenHits++)
		// 	}
		// }
		// console.log('this is the anime ' + enemyid(id))
		// for(var i = 0; i < players.length; i++){
		// 	if(players[i].id != socket.id){
		// 		enemy = players[i];

		// 		for (var n = 0; n < players.length; n++) {
		// 			if(players.locations[n] == obj.coordination){
		// 				hit = true
		// 			}
		// 		}

		// 		if(hit){
		// 			console.log(enemy.takenHits++);
		// 		}
		// 	}
		// }

	});

	socket.on('disconnect', function(){
		roomCapicity--;
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

function playerid(id)
{
		for (var i = 0; i < players.length; i++) {
		var currentPlayer = players[i];
		if(currentPlayer.id == id) return currentPlayer.id;
		}
}