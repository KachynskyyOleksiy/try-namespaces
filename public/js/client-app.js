var tryApp = angular.module('tryApp', ['ngRoute']);

tryApp.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl : 'partials/home.html',
  })
  .when('/about', {
    templateUrl : 'partials/about.html',
  })
  .otherwise({
    templateUrl : 'partials/404.html',
  });
});



// var socket = io.connect('http://localhost:8080');
// socket.on('messages', function(data) {
//   console.log(data.hello);
// });

// $('#chat_form').submit(function (e) {
//   var message = $('#input_text').val();
//   socket.emit('messages', message);
//   return false;
// });

// socket.on('messages', function (data) {
//   $('#chat-log').append(data +'<br/>');
// });

// socket.on('connect', function (data) {
//   $('#status').html('Connected to chat room');
//   nickname = prompt("What is your nickname?");
//   //notify the server of the users nickname
//   socket.emit('join', nickname);
// });
