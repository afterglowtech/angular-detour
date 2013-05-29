define([], function () {
  'use strict';

  var app = angular.module('app', ['agt.detour']);


  app.run([ '$rootScope', '$detour', '$stateParams',
    function($rootScope,   $detour,   $stateParams) {

      $detour.mergeJson({
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
              templateUrl: 'partials/home.html',
              controller: 'homeController',
              dependencies: ['controllers/homeController']
            }
          },
          {
            name: 'contacts', definition: {
              url: '/contacts',
              abstract: true,
              templateUrl: 'partials/contacts.html',
              controller: 'contactsController',
              dependencies: ['controllers/contactsController']
            },
            children: [
              {
                name: 'list', definition: {
                  url: '',
                  templateUrl: 'partials/contacts.list.html'
                }
              },
              {
                name: 'detail', definition: {
                  url: '/{contactId}',
                  aliases: {'/c?id': '/:id', '/user/{id}': '/:id'},
                  resolveServices: {
                    something: 'getContactIdFromParams'
                  },
                  dependencies: ['controllers/contactsDetailController', 'services/getContactIdFromParams', 'services/getContactIdHtml'],
                  views: {
                    '': {
                      templateUrl: 'partials/contacts.detail.html',
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
                      dependencies: ['controllers/contactsDetailItemController'],
                      views: {
                        '': {
                          templateUrl: 'partials/contacts.detail.item.html',
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
                          dependencies: ['controllers/contactsDetailItemEditController'],
                          views: {
                            '@contacts.detail': {
                              templateUrl: 'partials/contacts.detail.item.edit.html',
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
              dependencies: ['services/getHelloWorld'],
              i: 'getHelloWorld'
            }
          }
        ]
      });

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
