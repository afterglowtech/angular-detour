define(['detourService'], function (detour) {
  detour.registerController([
    'homeController',
    [        '$scope', '$detour',
    function ($scope,   $detour) {
      $scope.removeAbout = function() {
        $detour.mergeJson({
          t: [
            {
              name: 'about', 'delete': true
            }
          ]
        });
      };

      $scope.addAbout = function() {
        $detour.mergeJson({
          t: [
            {
              name: 'about', definition: {
                url: '/about',
                dependencies: ['services/getHelloWorld'],
                i: 'getHelloWorld'
              }
            }
          ]
        });
      };
    }]
  ]);
});
