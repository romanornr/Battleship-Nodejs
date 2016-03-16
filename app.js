//import Express
var app = require('express')();

//create a NodeJs http server
	var http = require('http').Server(app);

	var io = require('socket.io')(http);

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});


var players = {};
var rooms = ['ship'];

	io.on('connection', function(socket){
		console.log('A player is connected');

		socket.on('disconnect', function(){
			console.log('a Player disconnect');
		}); 
	});

//let it listen on port
	http.listen(1337, function()
	{
		console.log('listening on port 1337');
	});