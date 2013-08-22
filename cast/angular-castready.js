/*
 * angular-cast-ready v0.0.1
 * (c) 2013 Rob Becker http://robrbecker.com
 * License: MIT
 */

'use strict';

angular.module('castReady', []).
  factory('castReady', function ($rootScope) {
    return function (fn) {
      var queue = [];

      var impl = function () {
        queue.push(Array.prototype.slice.call(arguments));
      };

      document.addEventListener('message', function (event) {
        debugger;
        if (event.source == window && event.data && 
            event.data.source == "CastApi" &&
            event.data.event == "Hello") {


          queue.forEach(function (args) {
            fn.apply(this, args);
          });
          impl = fn;
        }
      }, false);
      
      return function () {
        return impl.apply(this, arguments);
      };
    };
  });