function oktvReceiverCtrl($scope, $timeout) {

    var namespace = "OKTV-GDG-GOOGLECAST-DEMO";
    var castAppId = '696627a5-d66b-4a7f-b8cc-b701b76e47b8_1';
    var receiver = new cast.receiver.Receiver(castAppId, [namespace]);
    var channelHandler = new cast.receiver.ChannelHandler(namespace);
    var idleTimeout = $timeout(function(){ window.close();}, 10000)

    $scope.vm = {
      commandsReceived: 0,
      command: 'like: OK TV, watch House of Cards'
    }

    channelHandler.addChannelFactory(receiver.createChannelFactory(namespace));

    receiver.start();

    channelHandler.addEventListener(cast.receiver.Channel.EventType.MESSAGE, onMessage.bind(this));


    function onMessage(event) {
      $timeout.cancel(idleTimeout);
      idleTimeout = $timeout(function(){ window.close();}, 10000)
      $scope.$apply(function() {
        $scope.vm.commandsReceived = $scope.vm.commandsReceived + 1;
        $scope.vm.command = event.message.command;
      });
    }
}