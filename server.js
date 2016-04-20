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

app.get('/api/send-message-to-all/', function(request, response) {
  gameSocketS.emit('hi', 'all');
  console.log('send message to all in GAME NS');
  
  response.sendStatus(200);
});
//----------------------------------------------------



//---------------------Sockets-------------------------------
io.of('/').on('connection', function(socket) {
  console.log('someone Connected to ROOT NS');

  socket.on('disconnect', function(){
    console.log('someone Disconnected from ROOT NS');
  });
});


var gameSocketS = io.of('/game');

gameSocketS.on('connection', function(socket){
  console.log('someone Connected to GAME NS');
  socket.emit('hi', 'Hi, someone!');

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
