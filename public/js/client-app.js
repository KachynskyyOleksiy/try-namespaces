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
  .when('/audio', {
    controller : 'audioController',
    templateUrl : 'partials/audio.html',
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


tryApp.controller('homeController', ['$scope', '$http', 'SocketFactory', function($scope, $http, SocketFactory){
  console.log('homeController');

  var gameSocket;

  $scope.connectToGameNS = function(){
    gameSocket = SocketFactory('game');

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
    chatSocket = SocketFactory('chat');
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
    rootSocket = SocketFactory();
    console.log(rootSocket);
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



tryApp.factory('SocketFactory', ['$rootScope', '$cacheFactory', function ($rootScope, $cacheFactory) {
  var sockets = $cacheFactory('socket-connections');
  return function (namespace) {
    var ns = namespace? '/'+namespace: '/'; 
    var socket;
    if (!sockets.get(ns)) {
      sockets.put(ns, io.connect(ns));
      console.log('create new socket', ns); // - for test! should remove!
    }
    socket = sockets.get(ns);
    return {
      on: on.bind(null, socket),
      emit: emit.bind(null, socket),
      disconnect: disconnect.bind(null, socket)
    };
  };

  function on(socket, event, callback) {
    socket.on(event, function () {  
      var args = arguments;
      $rootScope.$applyAsync(function () {
        callback.apply(socket, args);
      });
    })
  }

  function emit(socket, eventName, data, callback) {
    socket.emit(eventName, data, function () {
      var args = arguments;
      $rootScope.$applyAsync(function () {
        if (callback) {
          callback.apply(socket, args);
        }
      });
    })
  }
  
  function disconnect(socket) {
    sockets.remove(socket.nsp);
    socket.disconnect();
  }

}]);




tryApp.controller('audioController', ['$scope', 'audioFactory', function($scope, audioFactory){
  console.log('audioController!');

  $scope.audio1 =  function(){audioFactory.play('wet');}; 
  $scope.audio2 =  function(){audioFactory.play('hiccup');};  
}]); 

var API_URL = 'http://localhost:8080/';

tryApp.factory('audioFactory', ['$http', '$q', function ($http, $q) {
  var sounds = {};
  function init(){
    console.log('initialize audioFactory');
    var audio = document.createElement('audio');
    audio.src = API_URL + 'sounds/wet.mp3'
    console.log(audio.src);
    sounds['wet'] = audio;

    var audio2 = document.createElement('audio');
    audio2.src = API_URL + 'sounds/hiccup.mp3'
    console.log(audio2.src);
    sounds['hiccup'] = audio2;
  }
  init();

  var promise = $q.when(true);

  var getPromise = function(name) {
    var deferred = $q.defer();
    sounds[name].addEventListener('ended', deferred.resolve);
    sounds[name].play();
    deferred.promise.then(function () {
      sounds[name].removeEventListener('ended', deferred.resolve);
    });
    return deferred.promise;
  };

  function play(name){
    console.log('play', name);
    promise = promise.then(function() {
      return getPromise(name);
    });
  };

  var factory = {
    play: play
  };

  return factory;
}]);