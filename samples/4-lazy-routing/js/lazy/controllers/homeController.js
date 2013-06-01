define(['detourService'], function (detour) {
  detour.registerController([
    'homeController',
    [        '$scope', '$detour',
    function ($scope,   $detour) {
      $scope.removeAbout = function() {
        $detour.mergeJson({
          t: {
            'about': {'delete': true }
          }
        });
      };

      $scope.addAbout = function() {
        $detour.mergeJson({
          t: {
            'about': {
              definition: {
                url: '/about',
                dependencies: ['lazy/services/getHelloWorld'],
                i: 'getHelloWorld'
              }
            }
          }
        });
      };
    }]
  ]);
});
