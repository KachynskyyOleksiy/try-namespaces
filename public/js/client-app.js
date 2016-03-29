var tryApp = angular.module('tryApp', ['ngRoute']);

tryApp.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller : 'homeController',
    templateUrl : 'partials/home.html',
  })
  .when('/about', {
    templateUrl : 'partials/about.html',
  })
  .when('/players', {
    controller : 'playersController',
    templateUrl : 'partials/players.html',
  })
  .when('/game', {
    templateUrl : 'partials/game.html',
  })
  .otherwise({
    templateUrl : 'partials/404.html',
  });
});

tryApp.factory('socketio', ['$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}]);


// var socket;

tryApp.controller('mainController', ['$scope', 'socketio', '$http', function($scope, socketio, $http){
    console.log('mainController!');

    $http.get('/api/records')
    .then(function(response) {
        $scope.records = response.data;
    });

    socketio.on('updateRecords', function() {
      console.log('updateRecords');
      $http.get('/api/records')
      .then(function(response) {
          $scope.records = response.data;
      });
    });

    socketio.on('connect', function(data) {
      userName = prompt("What is your name?");
      socketio.emit('join', userName);
    });

    // socket.on('newNamaspace', function(data){
    //   console.log(data);
    // });
}]); 

tryApp.controller('homeController', ['$scope', function($scope){
  console.log('homeController');
  $scope.hi = function(){
    console.log('hi!');
  };
}]); 

tryApp.controller('playersController', ['$scope', '$http', 'socketio', function($scope, $http, socketio){
  console.log('playersController');

  $http.get('api/users-online')
  .then(function(response) {
      $scope.usersOnline = response.data;
  });


  socketio.on('userList', function(data) {
    $scope.usersOnline = data;
    console.log(data);
  });

}]); 
