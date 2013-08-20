define(['angular-detour'], function () {
  'use strict';

  var app = angular.module('app', ['agt.detour']);

  app.config(['$locationProvider', '$provide', '$detourProvider',
    function ($locationProvider, $provide, $detourProvider) {
      //comment out the decorator function for html5mode
      //uncomment the decorator function for forced hash(bang) mode
      // $provide.decorator('$sniffer', function($delegate) {
      //   $delegate.history = false;
      //   return $delegate;
      // });
      $locationProvider.html5Mode(true);

      //demonstrates ui-router style syntax
      //plus:
      // otherwise function (on $detourProvider instead of $urlRouterProvider)
      // aliases (instead of $urlRouterProvider when functions)
      // dependencies (lazy-loading controllers)

      //otherwise is defined in detour instead of urlRouterProvider,
      //unlike ui-router
      $detourProvider.otherwise('/404')

      .state('404', {
        url: '/404',
        templateUrl: 'partials/fourOhfour.html'
      })

      .state('home', {
        url: '/',

        //aliases is like urlRouterProvider.when
        aliases: {'': '^/'},

        template: '<p class="lead">Welcome to the agt.detour ui-router compatibility sample<' + '/p><p>Use the menu above to navigate<' + '/p>' +
          '<p>Look at <a href="#/c?id=1">Alice<' + '/a> or <a href="/user/42">Bob<' + '/a> to see a URL with a ' +
          'redirect in action.<' + '/p><p>Just don\'t <a href="/getLost">get lost<' + '/a>!<' + '/p>'
      })

      .state('contacts', {
        url: '/contacts',
        abstract: true,
        templateUrl: 'partials/contacts.html',
        controller:  [        '$scope', '$detour',
          function ($scope,   $detour) {
            $scope.contacts = [{
              id: 1,
              name: 'Alice',
              items: [{
                id: 'a',
                type: 'phone number',
                value: '555-1234-1234'
              },{
                id: 'b',
                type: 'email',
                value: 'alice@mailinator.com'
              }]
            }, {
              id: 42,
              name: 'Bob',
              items: [{
                id: 'a',
                type: 'blog',
                value: 'http://bob.blogger.com'
              },{
                id: 'b',
                type: 'fax',
                value: '555-999-9999'
              }]
            }, {
              id: 123,
              name: 'Eve',
              items: [{
                id: 'a',
                type: 'full name',
                value: 'Eve Adamsdottir'
              }]
            }];

            $scope.goToRandom = function () {
              /*jshint eqeqeq:false */
              var contacts = $scope.contacts, id;
              do {
                id = contacts[Math.floor(contacts.length * Math.random())].id;
              } while (id == $detour.params.contactId);
              $detour.transitionTo('contacts.detail', { contactId: id });
            };
          }
        ]
      })

      .state('contacts.list', {
        url: '',
        templateUrl: 'partials/contacts.list.html'
      })

      .state('detail', {
        parent: 'contacts',
        url: '/{contactId}',
        aliases: {'/c?id': '/:id', '/user/{id}': '/:id'},
        resolve: {
          something:
            [        '$timeout', '$stateParams',
            function ($timeout,   $stateParams) {
              return $timeout(function () { return 'Asynchronously resolved data (' + $stateParams.contactId + ')'; }, 10);
            }]
        },
        views: {
          '': {
            templateUrl: 'partials/contacts.detail.html',
            controller: [        '$scope', '$stateParams', 'something',
              function ($scope,   $stateParams,   something) {
                $scope.something = something;
                $scope.contact = findById($scope.contacts, $stateParams.contactId);
              }
            ]
          },
          'hint@': {
            template: 'This is contacts.detail populating the view "hint@"'
          },
          'menu': {
            templateProvider:
              [ '$stateParams',
              function ($stateParams){
                // This is just to demonstrate that $stateParams injection works for templateProvider
                // $stateParams are the parameters for the new state we're transitioning to, even
                // though the global '$stateParams' has not been updated yet.
                return '<hr><small class="muted">Contact ID: ' + $stateParams.contactId + '<' + '/small>';
              }]
          }
        }
      })

      .state('item', {
        parent: 'contacts.detail',
        url: '/item/:itemId',
        views: {
          '': {
            templateUrl: 'partials/contacts.detail.item.html',
            controller:  [        '$scope', '$stateParams', '$detour',
              function ($scope,   $stateParams,   $detour) {
                $scope.item = findById($scope.contact.items, $stateParams.itemId);
                $scope.edit = function () {
                  $detour.transitionTo('contacts.detail.item.edit', $stateParams);
                };
              }
            ]
          },
          'hint@': {
            template: 'Overriding the view "hint@"'
          }
        }
      })

      .state('contacts.detail.item.edit', {
        views: {
          '@contacts.detail': {
            templateUrl: 'partials/contacts.detail.item.edit.html',
            controller: [        '$scope', '$stateParams', '$detour',
              function ($scope,   $stateParams,   $detour) {
                $scope.item = findById($scope.contact.items, $stateParams.itemId);
                $scope.done = function () {
                  $detour.transitionTo('contacts.detail.item', $stateParams);
                };
              }
            ]
          }
        }
      })

      .state('about', {
        url: '/about',
        templateProvider:
          [        '$timeout',
          function ($timeout) {
            return $timeout(function () { return 'Hello world'; }, 100);
          }]
      })

      // must call initialize, unlike ui-router
      .initialize();
    }
  ]);

  app.run([ '$rootScope', '$detour', '$stateParams',
    function($rootScope,   $detour,   $stateParams) {
      //"cheating" so that detour is available in requirejs
      //define modules -- we want run-time registration of components
      //to take place within those modules because it allows
      //for them to have their own dependencies also be lazy-loaded.
      //this is what requirejs is good at.

      //if not using any dependencies properties in detour states,
      //then this is not necessary
      app.detour = $detour;


      //the sample reads from the current $detour.state
      //and $stateParams in its templates
      //that it the only reason this is necessary
      $rootScope.$detour = $detour;
      $rootScope.$stateParams = $stateParams;
    }
  ]);

  return app;

});
