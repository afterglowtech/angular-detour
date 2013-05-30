// var   matchSvc = '$match'
//       , abstractVar = 'abstract'
//       , detourSvc = '$detour'
// ;

function $RouteLoaderProvider(
  // $urlMatcherFactory
) {
  var that = this;

  this.getRouteUrl = null;
  this.knownStatesParameter = 'k';
  this.routeParameter = 'r';
  this.getUpdatesUrl = null;


  //***************************************
  //service definition
  //***************************************
  function $get(
    $q, $location, $http
    // $rootScope,   $q,   $templateFactory,   $injector,   $stateParams,   $location, $couchPotato
  ) {

    function RouteLoader() {
      this._getRouteUrl = that.getRouteUrl;
      this._knownStatesParameter = that.knownStatesParameter;
      this._routeParameter = that.routeParameter;
      this._getUpdatesUrl = that.getUpdatesUrl;

      this.getRoute = function(knownStates) {
        var route = $location.path();

        var requestUrl = this.getRouteUrl
          + '?' + this.routeParameter + '=' + encodeURIComponent(route)
          + '&' + this.knownStatesParameter + '=' + encodeURIComponent(angular.toJson(knownStates));

        var deferred = $q.defer();

        $http({method: 'GET', url: requestUrl}).
          success(function(data, status, headers, config) {
            deferred.resolve(angular.fromJson(data));
          }).
          error(function(data, status, headers, config) {
            deferred.reolve(null);
          });

        return deferred.promise;
      };
    }

    Object.defineProperty(RouteLoader.prototype, 'getRouteUrl', {
      get: function() { return this._getRouteUrl; },
      set: function(val) { this._getRouteUrl = val; }
    });

    Object.defineProperty(RouteLoader.prototype, 'knownStatesParameter', {
      get: function() { return this._knownStatesParameter; },
      set: function(val) { this._knownStatesParameter = val; }
    });

    Object.defineProperty(RouteLoader.prototype, 'routeParameter', {
      get: function() { return this._routeParameter; },
      set: function(val) { this._routeParameter = val; }
    });

    Object.defineProperty(RouteLoader.prototype, 'getUpdatesUrl', {
      get: function() { return this._getUpdatesUrl; },
      set: function(val) { this._getUpdatesUrl = val; }
    });

    return new RouteLoader();
  }
  $get.$inject = ['$q', '$location', '$http'];
  // $get.$inject = ['$rootScope', '$q', '$templateFactory', '$injector', '$stateParams', '$location', '$couchPotato'];
  this.$get = $get;

}
// $LazyLoaderProvider.$inject = ['$urlMatcherFactoryProvider'];

angular.module('agt.detour')
  .provider('$routeLoader', $RouteLoaderProvider);
