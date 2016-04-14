// Load modules
var express = require('express');
var app = express();
var md5 = require('md5');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Settings
// process.env.PORT is for using env settings, for example deploy on heroku
var port = process.env.PORT || 8080;
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/', function(request, response) {
  response.sendFile(__dirname + "/public/html/index.html");
});


// Start server
server.listen(port, function() {
  console.log("Server listen on port "+ port +"...");
});


//----------------------------------------------------
var gameSocketS = io.of('/game');

gameSocketS.on('connection', function(socket){
  console.log('someone connected to game socket');
  socket.on('disconnect', function() {
    console.log('someone disconnected');
  });
  socket.on('join', function(room) {
    socket.join(room);
    console.log('socket JOIN to', room);
  });
  gameSocketS.emit('hi', 'Hi, player!');
});


