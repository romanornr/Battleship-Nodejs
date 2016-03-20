//import Express
var app = require('express')();

//create a NodeJs http server
	var http = require('http').Server(app);

	var io = require('socket.io')(http);

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});


var players = [];

io.on('connection', function(socket){

if (players.length >= 2)
{
	socket.emit('RoomIsFull', true);
	console.log('Room is ful');
} else {
	var id = socket.id;
	players.push({'id' : id, 'ready': false});
	console.log('Player ' + id + ' joined' );
}

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
