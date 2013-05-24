define([], function () {
  'use strict';

  var app = angular.module('app', ['agt.detour']);
  app.config(['$locationProvider', '$detourProvider',
    function ($locationProvider, $detourProvider) {
      //$locationProvider.html5Mode(true);

      $detourProvider.otherwise('/404');
      $detourProvider.state('404', {
        url: '/404',
        templateUrl: '/sample/partials/fourOhfour.html'
      });


      $detourProvider.state('home', {
        url: '/',
        aliases: {'': '^/'},
        template: '<p class="lead">Welcome to the agt.detour sample<' + '/p><p>Use the menu above to navigate<' + '/p>' +
          '<p>Look at <a href="#/c?id=1">Alice<' + '/a> or <a href="#/user/42">Bob<' + '/a> to see a URL with a ' +
          'redirect in action.<' + '/p><p>Just don\'t <a href="#/getLost">get lost<' + '/a>!<' + '/p>'
      });

      var contacts = $detourProvider.setChild({
        localName: 'contacts',
        url: '/contacts',
        abstract: true,
        templateUrl: '/sample/partials/contacts.html',
        controller: 'contactsController',
        dependencies: ['controllers/contactsController']
      });

      contacts.setChild({
        localName: 'list',
        url: '',
        templateUrl: '/sample/partials/contacts.list.html'
      });

      var detail = contacts.setChild({
        localName: 'detail',
        // parent: 'contacts',
        url: '/{contactId}',
        aliases: {'/c?id': '/:id', '/user/{id}': '/:id'},
        resolve: {
          something:
            [        '$timeout', '$stateParams',
            function ($timeout,   $stateParams) {
              return $timeout(function () { return 'Asynchronously resolved data (' + $stateParams.contactId + ')'; }, 10);
            }]
        },
        dependencies: ['controllers/contactsDetailController'],
        views: {
          '': {
            templateUrl: '/sample/partials/contacts.detail.html',
            controller: 'contactsDetailController'
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
      });

      var detailItem = detail.setChild({
        localName: 'item',
        // parent: 'contacts.detail',
        url: '/item/:itemId',
        dependencies: ['controllers/contactsDetailItemController'],
        views: {
          '': {
            templateUrl: '/sample/partials/contacts.detail.item.html',
            controller: 'contactsDetailItemController'
          },
          'hint@': {
            template: 'Overriding the view "hint@"'
          }
        }
      });

      detailItem.setChild({
        localName: 'edit',
        dependencies: ['controllers/contactsDetailItemEditController'],
        views: {
          '@contacts.detail': {
            templateUrl: '/sample/partials/contacts.detail.item.edit.html',
            controller: 'contactsDetailItemEditController'
          }
        }
      });

      $detourProvider.setChild({
        localName: 'about',
        url: '/about',
        templateProvider:
          [        '$timeout',
          function ($timeout) {
            return $timeout(function () { return 'Hello world'; }, 100);
          }]
      });

      $detourProvider.initialize();
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
