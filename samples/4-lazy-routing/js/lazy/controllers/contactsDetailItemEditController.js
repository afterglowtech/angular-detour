define(['detourService'], function (detour) {
  detour.registerController([
    'contactsDetailItemEditController',
    [        '$scope', '$stateParams', '$detour',
    function ($scope,   $stateParams,   $detour) {
      $scope.item = findById($scope.contact.items, $stateParams.itemId);
      $scope.done = function () {
        $detour.transitionTo('contacts.detail.item', $stateParams);
      };
    }]
  ]);
});
