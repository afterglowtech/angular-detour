define(['detourService'], function (detour) {
  detour.registerFactory([
    'getContactIdHtml',
    [ '$stateParams',
    function ($stateParams){
      var svc = {};
      svc.getTemplate = function(params, locals) {
        // This is just to demonstrate that $stateParams injection works for templateProvider
        // $stateParams are the parameters for the new state we're transitioning to, even
        // though the global '$stateParams' has not been updated yet.
        return '<hr><small class="muted">Contact ID: ' + params.contactId + '<' + '/small>';
      };
      return svc;

    }]
  ]);
});
