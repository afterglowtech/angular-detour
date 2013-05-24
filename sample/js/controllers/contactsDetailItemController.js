define(['detourService'], function (detour) {
  detour.registerController([
    'contactsDetailItemController',
    [        '$scope', '$stateParams', '$detour',
    function ($scope,   $stateParams,   $detour) {
      $scope.item = findById($scope.contact.items, $stateParams.itemId);
      $scope.edit = function () {
        $detour.transitionTo('contacts.detail.item.edit', $stateParams);
      };
    }]
  ]);
});
