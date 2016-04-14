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

app.get('/api/users-online', function(request, response) {
  response.send(getUsersOnline());
});

app.get('/api/records', function(request, response) {
  response.send(getRecords());
});

app.get('/api/get-namespace/:username', function(request, response) {
  response.send(getUserNamespace(request.params.username));
});

// app.get('/api/invite/:userId', function(request, response) {
//   io.of(ns).emit('invite', data);
//   response.send(getUserNamespace(request.params.username));
// });




// Start server
server.listen(port, function() {
  console.log("Server listen on port "+ port +"...");
});



var users = [
{
  id: '1',
  name: "Ivan",
  online: false,
  namespace: "nsIvan",
  maxScore: 70
},
{
  id: '2',
  name: "Petro",
  online: false,
  namespace: "nsPetro",
  maxScore: 90
},
{
  id: '3',
  name: "Foo",
  online: false,
  namespace: "nsFoo",
  maxScore: 100
},
{
  id: '4',
  name: "Bar",
  online: false,
  namespace: "nsBar",
  maxScore: 55
}
];

io.on('connection', function(client){
  updateRecords();
  client.on('join', function(userName) {
    client.name = userName;
    setStatus(client.name, true);
    //setNamespace(client.name);

    console.log(client.name + ' connected to general BUS.');
    
    client.emit('userList', getUsersOnline());
    client.broadcast.emit('userList', getUsersOnline());

    var ns = getUserNamespace(client.name);
    io.of(ns).on('connection', function(socket){
      socket.name = client.name;
      console.log(client.name + ' connected to own namespace: ' + ns);

      socket.on('invite', function(userId){
        console.log(socket.name + " invite " + getUser(userId).name);
        io.of(getUserNamespacebyId(userId)).emit('incomingInvite', {
          userName: socket.name,
          userId: getUserIdByName(client.name)
        })
      }); 

      socket.on('accept', function(userId){
        console.log('Game started: ' + socket.name + ' vs ' + getUser(userId).name);
        var data = {player1: socket.name, player2: getUser(userId).name}
        io.of(getUserNamespacebyId(userId)).emit('startGame', data);
        io.of(getUserNamespace(socket.name)).emit('startGame', data);
      });
      socket.on('disconnect', function(){
        setStatus(client.name, false);
        //clearNamespace(client.name);
        //client.broadcast.emit('userList', getUsersOnline());
        console.log(socket.name + ' disconnect form own namespace.');
      });
    }); 


  });


  client.on('disconnect', function(){
    setStatus(client.name, false);
    //clearNamespace(client.name);
    client.broadcast.emit('userList', getUsersOnline());
    
    console.log(client.name + ' disconnect form general BUS.');
  });
});

callNTimes(100, 20000, function() { 
  updateRecords();
  io.emit('updateRecords');
});













// Work with users

function getAllUsers() {
  return users;
}

function getUsersOnline() {
  var users = getAllUsers();
  var onlineUsers = [];
  for (var i=0; i<users.length; i++){
    if (users[i].online == true){
      onlineUsers.push({
        'id': users[i].id,
        'name': users[i].name
      });
    }
  }
  return onlineUsers;
}

function getUser(userId) {
  var users = getAllUsers();
  for (var i=0; i<users.length; i++){
    if (users[i].id == userId){
      user = {
        "name": users[i].name
      }
      return user;
    }
  }
}

function getUserNamespace(userName) {
  var users = getAllUsers();
  for (var i=0; i<users.length; i++){
    if (users[i].name == userName){
      return users[i].namespace;
    }
  }
}

function getUserNamespacebyId(userId) {
  var users = getAllUsers();
  for (var i=0; i<users.length; i++){
    if (users[i].id == userId){
      return users[i].namespace;
    }
  }
}

function getUserIdByName(userName) {
  var users = getAllUsers();
  for (var i=0; i<users.length; i++){
    if (users[i].name == userName){
      return users[i].id;
    }
  }
}

function getRecords() {
  var users = getAllUsers();
  var records = [];
  for (var i=0; i<users.length; i++){
    records.push({
      'userName': users[i].name,
      'score': users[i].maxScore
    });
  }
  return records;
}

function setStatus(userName, status) {
  var users = getAllUsers();
  for (var i=0; i<users.length; i++){
    if (users[i].name == userName){
      users[i].online = status;
    }
  }
}

function setNamespace(userName) {
  var users = getAllUsers();
  for (var i=0; i<users.length; i++){
    if (users[i].name == userName){
      var timestamp = new Date().getTime();
      var nsp = md5(timestamp+userName);
      users[i].namespace = nsp;
    }
  }
}

function clearNamespace(userName) {
  var users = getAllUsers();
  for (var i=0; i<users.length; i++){
    if (users[i].name == userName){
      users[i].namespace = "";
    }
  }
}


// Randomizing records
function updateRecords() {
  for (var i=0; i<users.length; i++){
    users[i].maxScore = getRandomInt(10, 100);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function callNTimes(n, time, fn) {
  function callFn() {
    if (--n < 0) return;
    fn();
    setTimeout(callFn, time);
  }
  setTimeout(callFn, time);
}



app.get('/records', function(request, response) {
  var records = [
    {userName: 'Ivan', score: Math.floor(Math.random() * (100 - 10 + 1) + 10) },
    {userName: 'Petro', score: Math.floor(Math.random() * (100 - 10 + 1) + 10) },
    {userName: 'Foo', score: Math.floor(Math.random() * (100 - 10 + 1) + 10) },
    {userName: 'Bar', score: Math.floor(Math.random() * (100 - 10 + 1) + 10) },
  ];
  response.send(records);
});