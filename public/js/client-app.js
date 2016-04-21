var tryApp = angular.module('tryApp', ['ngRoute']);

tryApp.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller : 'homeController',
    templateUrl : 'partials/home.html',
  })
  .when('/game', {
    controller : 'gameController',
    templateUrl : 'partials/game.html',
  })
  .otherwise({
    templateUrl : 'partials/404.html',
  });
});


tryApp.controller('mainController', ['$scope', function($scope){
  console.log('mainController!');
}]); 

tryApp.controller('gameController', ['$scope', function($scope){
  console.log('gameController!');
}]); 


tryApp.controller('homeController', ['$scope', '$http', function($scope, $http){
  console.log('homeController');

  // var gameSocket = io('/game');
  var gameSocket;

  $scope.connectToGameNS = function(){
    gameSocket = io.connect('/game');

    gameSocket.on('connect', function(data) {
      console.log('connected to GAME NS');
    });

    gameSocket.on('hi', function(data) {
      console.log('event: hi, data:', data);
    });
    gameSocket.on('disconnect', function(data) {
      console.log('disconnected from GAME NS');
    });


    $scope.disconnectFromGameNS = function(){
      gameSocket.disconnect();
    };

    $scope.joinToRoom = function(room){
      gameSocket.emit('join', room);
      console.log('join to', room, '...');
    };

    $scope.leaveRoom = function(room){
      gameSocket.emit('leave', room);
      console.log('leave from', room, '...');
    };

  };

  var chatSocket;
  $scope.connectToChatNS = function(){
    chatSocket = io.connect('/chat');
    chatSocket.on('connect', function(data) {
      console.log('connected to CHAT NS');
    });

    chatSocket.on('hi', function(data) {
      console.log('event: hi, data:', data);
    });

    chatSocket.on('disconnect', function(data) {
      console.log('disconnected from CHAT NS');
    });

    $scope.disconnectFromChatNS = function(){
      chatSocket.disconnect();
    };

  };

  var rootSocket;
  $scope.connectToRootNS = function(){
    rootSocket = io.connect('/');
    rootSocket.on('connect', function(data) {
      console.log('connected to ROOT NS');
    });

    rootSocket.on('hi', function(data) {
      console.log('event: hi, data:', data);
    });

    rootSocket.on('disconnect', function(data) {
      console.log('disconnected from ROOT NS');
    });

    $scope.disconnectFromRootNS = function(){
      rootSocket.disconnect();
    };
    
  };





  //Server methods:
  $scope.messageTo = function(room){
    $http.get('/api/send-message-to/'+room)
    .then(function(response) {
        //console.log(response.status);
      });
  };

  $scope.messageToAllinGAME = function(){
    $http.get('/api/send-message-to-all-in-game-NS/')
    .then(function(response) {
        //console.log(response.status);
      });
  };

  $scope.messageToAllinCHAT = function(){
    $http.get('/api/send-message-to-all-in-chat-NS/')
    .then(function(response) {
        //console.log(response.status);
      });
  };

  $scope.messageToAllinROOT = function(){
    $http.get('/api/send-message-to-all-in-root-NS/')
    .then(function(response) {
        //console.log(response.status);
      });
  };


  //--------------


}]); 
