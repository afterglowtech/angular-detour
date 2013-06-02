define(['detourService'], function (detour) {
  detour.registerController([
    'homeController',
    [        '$scope', '$detour',
    function ($scope,   $detour) {
      $scope.removeAbout = function() {
        $detour.removeState('about');
        $detour.initialize();
      };

      $scope.addAbout = function() {
        $detour.setState({
          name: 'about',
          url: '/about',
          templateProvider:
            [        '$timeout',
            function ($timeout) {
              return $timeout(function () { return 'Hello world'; }, 100);
            }]
        });
        $detour.initialize();
      };
    }]
  ]);
});
