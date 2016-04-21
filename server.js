// Load modules
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Settings
// process.env.PORT is for using env settings
var port = process.env.PORT || 8080;
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

// Start server
server.listen(port, function() {
  console.log("Server listen on port "+ port +"...");
});
//----------------------------------------------------------



//---------------------Routes-------------------------------

app.get('/', function(request, response) {
  response.sendFile(__dirname + "/public/html/index.html");
});


app.get('/api/send-message-to/:room', function(request, response) {
  var room = request.params.room;
  msg = 'Hi, someone in ' + room;
  gameSocketS.to(room).emit('hi', msg);
  console.log('send message to', room);

  response.sendStatus(200);
});

app.get('/api/send-message-to-all-in-game-NS/', function(request, response) {
  gameSocketS.emit('hi', 'Hi all in GAME NS');
  console.log('send message to all in GAME NS');
  
  response.sendStatus(200);
});

app.get('/api/send-message-to-all-in-chat-NS/', function(request, response) {
  chatSocketS.emit('hi', 'Hi all in CHAT NS');
  console.log('send message to all in CHAT NS');
  
  response.sendStatus(200);
});

app.get('/api/send-message-to-all-in-root-NS/', function(request, response) {
  rootSocketS.emit('hi', 'HI all in ROOT NS');
  console.log('send message to all in ROOT NS');
  
  response.sendStatus(200);
});

//----------------------------------------------------



//---------------------Sockets-------------------------------
var rootSocketS = io.of('/');
rootSocketS.on('connection', function(socket) {
  socket.emit('hi', 'Hi, someone in ROOT ns!');
  console.log('someone Connected to ROOT NS');

  socket.on('disconnect', function(){
    console.log('someone Disconnected from ROOT NS');
  });
});

var chatSocketS = io.of('/chat');
chatSocketS.on('connection', function(socket) {
  socket.emit('hi', 'Hi, someone in CHAT ns!');
  console.log('someone Connected to CHAT NS');

  socket.on('disconnect', function(){
    console.log('someone Disconnected from CHAT NS');
  });
});


var gameSocketS = io.of('/game');

gameSocketS.on('connection', function(socket){
  socket.emit('hi', 'Hi, someone in GAME ns!');
  console.log('someone Connected to GAME NS');

  socket.on('disconnect', function() {
    console.log('someone disconnected from GAME NS');
    // console.log(getUsersInRoomNumber('room1', '/game'));
    if(io.nsps['/game'].adapter.rooms['room1'] == undefined) {console.log('room1 is empty!');}
    if(io.nsps['/game'].adapter.rooms['room2'] == undefined) {console.log('room2 is empty!');}
  });

  socket.on('join', function(room) {
    socket.join(room);
    console.log('socket JOIN to', room);
  });

  socket.on('leave', function(room) {
    socket.leave(room);
    console.log('socket LEAVE from', room);
  });

});


// var getUsersInRoomNumber = function(roomName, namespace) {
//   if (!namespace) namespace = '/';
//   var room = io.nsps[namespace].adapter.rooms[roomName];
//   if (!room) return null;
//   return Object.keys(room).length;
// };

//----------------------------------------------------
