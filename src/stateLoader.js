// var   matchSvc = '$match'
//       , abstractVar = 'abstract'
//       , detourSvc = '$detour'
// ;

function $StateLoaderProvider(
  // $urlMatcherFactory
) {
  var that = this;

  this.getRouteUrl = null;
  this.getStateUrl = null;
  this.knownStatesParameter = 'k';
  this.routeParameter = 'r';
  this.stateParameter = 's';
  this.getUpdatesUrl = null;


  //***************************************
  //service definition
  //***************************************
  function $get(
    $q, $location, $http
    // $rootScope,   $q,   $templateFactory,   $injector,   $stateParams,   $location, $couchPotato
  ) {

    function StateLoader() {
      this._getRouteUrl = that.getRouteUrl;
      this._getStateUrl = that.getStateUrl;
      this._knownStatesParameter = that.knownStatesParameter;
      this._routeParameter = that.routeParameter;
      this._stateParameter = that.stateParameter;
      this._getUpdatesUrl = that.getUpdatesUrl;

      function doGet(requestUrl) {
        var deferred = $q.defer();

        $http({method: 'GET', url: requestUrl}).
          success(function(data, status, headers, config) {
            console.log(data);
            deferred.resolve(angular.fromJson(data));
          }).
          error(function(data, status, headers, config) {
            deferred.resolve(null);
          });

        return deferred.promise;
      }

      this.getRoute = function(route, knownStates) {
        var requestUrl = this.getRouteUrl
          + '?' + this.routeParameter + '=' + encodeURIComponent(route)
          + '&' + this.knownStatesParameter + '=' + encodeURIComponent(angular.toJson(knownStates));

        return doGet(requestUrl);
      };

      this.getState = function(stateName, knownStates) {
        var requestUrl = this.getStateUrl
          + '?' + this.stateParameter + '=' + encodeURIComponent(stateName)
          + '&' + this.knownStatesParameter + '=' + encodeURIComponent(angular.toJson(knownStates));

        return doGet(requestUrl);
      };


    }

    Object.defineProperty(StateLoader.prototype, 'getRouteUrl', {
      get: function() { return this._getRouteUrl; },
      set: function(val) { this._getRouteUrl = val; }
    });

    Object.defineProperty(StateLoader.prototype, 'getStateUrl', {
      get: function() { return this._getStateUrl; },
      set: function(val) { this._getStateUrl = val; }
    });

    Object.defineProperty(StateLoader.prototype, 'knownStatesParameter', {
      get: function() { return this._knownStatesParameter; },
      set: function(val) { this._knownStatesParameter = val; }
    });

    Object.defineProperty(StateLoader.prototype, 'routeParameter', {
      get: function() { return this._routeParameter; },
      set: function(val) { this._routeParameter = val; }
    });

    Object.defineProperty(StateLoader.prototype, 'stateParameter', {
      get: function() { return this._stateParameter; },
      set: function(val) { this._stateParameter = val; }
    });

    Object.defineProperty(StateLoader.prototype, 'getUpdatesUrl', {
      get: function() { return this._getUpdatesUrl; },
      set: function(val) { this._getUpdatesUrl = val; }
    });

    return new StateLoader();
  }
  $get.$inject = ['$q', '$location', '$http'];
  // $get.$inject = ['$rootScope', '$q', '$templateFactory', '$injector', '$stateParams', '$location', '$couchPotato'];
  this.$get = $get;

}
// $LazyLoaderProvider.$inject = ['$urlMatcherFactoryProvider'];

angular.module('agt.detour')
  .provider('$stateLoader', $StateLoaderProvider);
