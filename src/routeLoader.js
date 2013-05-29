// var   matchSvc = '$match'
//       , abstractVar = 'abstract'
//       , detourSvc = '$detour'
// ;

function $RouteLoaderProvider(
  // $urlMatcherFactory
) {
  var that = this;


  //***************************************
  //service definition
  //***************************************
  function $get(
    $q
    // $rootScope,   $q,   $templateFactory,   $injector,   $stateParams,   $location, $couchPotato
  ) {

    var $routeLoader = {
    };

    $routeLoader.getRoute = function() {
      var deferred = $q.defer();
      deferred.resolve(theJson);
      return deferred.promise;
    };

    var theJson = {
      f: '/404',
      t: [
        {
          n: '404', d: {
            u: '/404',
            t: 'partials/fourOhfour.html'
          }
        },
        {
          name: 'home', definition: {
            url: '/',
            aliases: {'': '^/'},
            templateUrl: '/partials/home.html',
            controller: 'homeController',
            dependencies: ['lazy/controllers/homeController']
          }
        },
        {
          name: 'contacts', definition: {
            url: '/contacts',
            abstract: true,
            templateUrl: '/partials/contacts.html',
            controller: 'contactsController',
            dependencies: ['lazy/controllers/contactsController']
          },
          children: [
            {
              name: 'list', definition: {
                url: '',
                templateUrl: '/partials/contacts.list.html'
              }
            },
            {
              name: 'detail', definition: {
                url: '/{contactId}',
                aliases: {'/c?id': '/:id', '/user/{id}': '/:id'},
                resolveServices: {
                  something: 'getContactIdFromParams'
                },
                dependencies: ['lazy/controllers/contactsDetailController', 'lazy/services/getContactIdFromParams', 'lazy/services/getContactIdHtml'],
                views: {
                  '': {
                    templateUrl: '/partials/contacts.detail.html',
                    controller: 'contactsDetailController'
                  },
                  'hint@': {
                    template: 'This is contacts.detail populating the view "hint@"'
                  },
                  'menu': {
                    templateService: 'getContactIdHtml'
                  }
                }
              },
              children: [
                {
                  name: 'item', definition: {
                    url: '/item/:itemId',
                    dependencies: ['lazy/controllers/contactsDetailItemController'],
                    views: {
                      '': {
                        templateUrl: '/partials/contacts.detail.item.html',
                        controller: 'contactsDetailItemController'
                      },
                      'hint@': {
                        template: 'Overriding the view "hint@"'
                      }
                    }
                  },
                  children: [
                    {
                      name: 'edit', definition: {
                        dependencies: ['lazy/controllers/contactsDetailItemEditController'],
                        views: {
                          '@contacts.detail': {
                            templateUrl: '/partials/contacts.detail.item.edit.html',
                            controller: 'contactsDetailItemEditController'
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: 'about', definition: {
            url: '/about',
            dependencies: ['lazy/services/getHelloWorld'],
            i: 'getHelloWorld'
          }
        }
      ]
    };


    return $routeLoader;
  }
  $get.$inject = ['$q'];
  // $get.$inject = ['$rootScope', '$q', '$templateFactory', '$injector', '$stateParams', '$location', '$couchPotato'];
  this.$get = $get;

}
// $LazyLoaderProvider.$inject = ['$urlMatcherFactoryProvider'];

angular.module('agt.detour')
  .provider('$routeLoader', $RouteLoaderProvider);
