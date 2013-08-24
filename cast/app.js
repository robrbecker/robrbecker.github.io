/*
 @cast object will get automatically created by the Chomecast extension
  ONLY IF YOU HAVE THE CORRECT HTML TAG DECLARATIONS
 */

// service that provides a promise for when the cast api is available
angular.module('castReady', []).
  factory('castReady', function ($rootScope, $q) {
    var loadingDeferred = $q.defer();

    window.addEventListener('message', function() {
       if (event.source == window && event.data &&
           event.data.source == "CastApi" &&
           event.data.event == "Hello") {

         console.log('ChromeCast API ready');
         $rootScope.$apply(loadingDeferred.resolve);
       }
    });
    return function castReady() {
      return loadingDeferred.promise;
    };
  });


var castApp = angular.module('castApp',['castReady']);


castApp.controller('CastController',['castReady','$scope', function(castReady,$scope) {
  
  var namespace = "OKTV-GDG-GOOGLECAST-DEMO";
  var castAppId = '696627a5-d66b-4a7f-b8cc-b701b76e47b8_1';

  $scope.vm = {};

  $scope.fn = {
    onReceiverList: function(list) {
      $scope.$apply(function() {
        console.log(list.length,' Receiver(s) loaded');
        $scope.vm.receivers = list;
        if (list.length > 0) $scope.vm.selectedReceiver = list[0];
        else {
          $scope.vm.selectedReceiver = null;
          // where did all the chromecasts go?
        }
      });
    },
    launch: function() {
      var request = new cast.LaunchRequest(castAppId, $scope.vm.selectedReceiver);
      request.description = new cast.LaunchDescription();
      request.description.text = "HELLO GDG MISSOULA";
      request.description.url = "https://developers.google.com/groups/chapter/111917982940065392922/";
      $scope.vm.castApi.launch(request, $scope.fn.onLaunch);
    },
    onLaunch: function(activity) {
      console.log('In Launch Request Callback')
      if (activity.status === 'running') {
        $scope.vm.castApi.sendMessage(activity.activityId, namespace, {
          command: $scope.vm.command
        });
      }
    }
  }

  // run when controller initializes
  castReady().then(function() {
    $scope.vm.castApi = new cast.Api();
    $scope.vm.castApi.addReceiverListener("YouTube", $scope.fn.onReceiverList);
  });



}]);