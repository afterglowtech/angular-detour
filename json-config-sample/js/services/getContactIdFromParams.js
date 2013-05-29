define(['detourService'], function (detour) {
  detour.registerFactory([
    'getContactIdFromParams',
    [        '$timeout',
    function ($timeout) {
      var svc = {};
      svc.resolve = function(stateParams, locals) {
        return $timeout(function () { return 'Asynchronously resolved data (' + stateParams.contactId + ')'; }, 10);
      };
      return svc;
    }]
  ]);
});
