define(['detourService'], function (detour) {
  detour.registerFactory([
    'getHelloWorld',
    [        '$timeout',
    function ($timeout) {
      var svc = {};
      svc.getTemplate = function() {
        return $timeout(function () { return 'Hello world'; }, 100);
      };
      return svc;
    }]
  ]);
});
