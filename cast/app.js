/*
 @cast object will get automatically created by the Chomecast extension
  ONLY IF YOU HAVE THE CORRECT HTML TAG DECLARATIONS
 */

var castApp = angular.module('castApp',['castReady']);


castApp.controller('CastController',['castReady','$scope', function(castReady,$scope) {
  
  var namespace = "AF-GDG-GOOGLECAST-DEMO";
  var castAppId = '696627a5-d66b-4a7f-b8cc-b701b76e47b8_1';

  $scope.vm = {
    activity: { running: false}
  };
  
  window.vm = $scope.vm; // BAD!

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
      console.log('launching',castAppId, $scope.vm.selectedReceiver);
      $scope.vm.launchRequest = new cast.LaunchRequest(castAppId, $scope.vm.selectedReceiver);
      $scope.vm.launchRequest.description = new cast.LaunchDescription();
      $scope.vm.launchRequest.description.text = "HELLO GDG MISSOULA";
      $scope.vm.launchRequest.description.url = "https://developers.google.com/groups/chapter/111917982940065392922/";
      $scope.vm.castApi.launch($scope.vm.launchRequest, $scope.fn.onLaunch);
    },
    onLaunch: function(activity) {
      console.log('In Launch Request Callback', activity);
      $scope.$apply(function() {
        $scope.vm.activity = activity;
      });
    },
    sendMessage: function(string) {
      console.log('Sending message');
      if ($scope.vm.activity.status === 'running') {

        //REMIND ME TO PUT IN A RANDOM WORD HERE
        $scope.vm.castApi.sendMessage($scope.vm.activity.activityId, namespace, {
          command: $scope.vm.command,
          type: 'Hello GDG Missoula',
          name: $scope.vm.command,
          email: '',
          favorite: '',
          randomWord:'Queen is the best band EVAR!!!'
        });
      } else {
        // relaunch
        console.log('activity is not running');
        //$scope.fn.launch(  TODO CALL BACK);
      }
    },
    toggleListening: function() {
      if ($scope.vm.listening) $scope.recognition.stop();
      else $scope.recognition.start();
    }
  }

  // run when controller initializes
  castReady().then(function() {
    $scope.vm.castApi = new cast.Api();
    $scope.vm.castApi.addReceiverListener("YouTube", $scope.fn.onReceiverList);
    $scope.recognition = new webkitSpeechRecognition();
    $scope.recognition.continuous = true;
    $scope.recognition.interimResults = false;
    $scope.vm.listening = true;
    $scope.recognition.start();

    $scope.recognition.onstart = function() {
      $scope.$apply(function() {
        $scope.vm.listening = true;
      })
    };

    $scope.recognition.onend = function() {
      $scope.$apply(function() {
        $scope.vm.listening = false;
      })
    };

    $scope.recognition.onresult = function(event) {
      console.log(event);
      
      var final_transcript = '';
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      $scope.$apply(function() {
        $scope.vm.command = final_transcript;
        $scope.fn.sendMessage(final_transcript);
      });
      /*
      final_transcript = capitalize(final_transcript);
      final_span.innerHTML = linebreak(final_transcript);
      interim_span.innerHTML = linebreak(interim_transcript);
      if (final_transcript || interim_transcript) {
        showButtons('inline-block');
      }
      */
    };
  });



}]);