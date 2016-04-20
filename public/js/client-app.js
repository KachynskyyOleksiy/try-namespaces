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

  var gameSocket = io('/game');

  // $scope.connectToGameNS = function(){
  //   gameSocket = io.connect('/game');
  //   gameSocket.on('hi', function(data) {
  //     console.log('event: hi, data:', data);
  //   });
  // };

  $scope.disconnectFromGameNS = function(){
    gameSocket.disconnect();
    console.log('disconnect from GAME NS');
  };

  gameSocket.on('connect', function(data) {
    console.log('connected to GAME NS');
  });

  gameSocket.on('hi', function(data) {
    console.log('event: hi, data:', data);
  });

  $scope.joinToRoom = function(room){
    gameSocket.emit('join', room);
    console.log('join to', room, '...');
  };

  $scope.leaveRoom = function(room){
    gameSocket.emit('leave', room);
    console.log('leave from', room, '...');
  };



  //Server methods:
  $scope.messageTo = function(room){
    $http.get('/api/send-message-to/'+room)
    .then(function(response) {
        //console.log(response.status);
      });
  };

  $scope.messageToAll = function(){
    $http.get('/api/send-message-to-all/')
    .then(function(response) {
        //console.log(response.status);
      });
  };
  //--------------


}]); 
