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

io.on('connection', function(socket){

if (players.length >= 2)
{
	socket.emit('RoomIsFull', true);
	console.log('Room is ful');
} else {
	var id = socket.id;
	players.push({'id' : id, 'ready': true});
	console.log('Player ' + id + ' joined' );
}

socket.on('test', function(){
	if(players) console.log('good');
});


socket.on('ready', function(id){
	players.indexOf(playerID(id)).require = true;
	socket.broadcast.emit('enemyReady', true);
	console.log( id + 'is ready to play');
});

	socket.on('disconnect', function(){
		players.splice(playerID(socket,id), 1)
			console.log('a Player disconnect');
	}); 
});

//let it listen on port
http.listen(1337, function()
{
	console.log('listening on port 1337');
});

function playerID(id)
{
	players.forEach(function(e, i)
	{
		if(e.id == id) return e;
	});
}
