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
  