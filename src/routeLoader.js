// var   matchSvc = '$match'
//       , abstractVar = 'abstract'
//       , detourSvc = '$detour'
// ;

function $RouteLoaderProvider(
  // $urlMatcherFactory
) {
  var that = this;

  this.getRouteUrl = null;
  this.jsonSummaryParameter = 's';
  this.pathParameter = 'r';
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
      this._jsonSummaryParameter = that.jsonSummaryParameter;
      this._pathParameter = that.pathParameter;
      this._getUpdatesUrl = that.getUpdatesUrl;

      this.getRoute = function(jsonSummary) {
        var path = $location.path();

        var requestUrl = this.getRouteUrl
          + '?' + this.pathParameter + '=' + encodeURIComponent(path)
          + '&' + this.jsonSummaryParameter + '=' + encodeURIComponent(angular.toJson(jsonSummary));

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

    Object.defineProperty(RouteLoader.prototype, 'jsonSummaryParameter', {
      get: function() { return this._jsonSummaryParameter; },
      set: function(val) { this._jsonSummaryParameter = val; }
    });

    Object.defineProperty(RouteLoader.prototype, 'pathParameter', {
      get: function() { return this._pathParameter; },
      set: function(val) { this._pathParameter = val; }
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
