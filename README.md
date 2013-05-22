# angular-detour

## THIS IS ALL VERY DRAFTY.

Right now, what works is the loading of states as supported by ui-router.  Modifying those states manually with script is implemented but not tested.  No support yet for lazy loading routes or server-driven updates/modifications/deletes.

steps:
* npm install
* grunt build
* node server.js
* http://localhost/sample

If you run grunt (as opposed to grunt build) it will try to run tests that are not yet functional.

#### Lazy-loaded/runtime-configurable/server-defined routing for AngularJS applications
*detour* will be an Angular Service Provider that can be used by applications that require routing to be server-controlled with client-side routing speed.  Using [angular-ui/ui-router](http://github.com/angular-ui/ui-router) as a starting point, this project will allow for lazy loading of route definitions as well as updates, additions and deletes of routes either through client code or from server-supplied JSON definitions.

* **updates to *loaded* states** (i.e. those that were in default set + those that have been loaded lazily -- requires round trips that include all state names known to the client -- returns set of changes to those) -- can be invoked directly, or on a schedule -- does not lazily load anything
* **lazy loads** -- if a route is requested that is not handled by any state known to the client, then *before* the fallback state is selected, a round trip to the server will be invoked.  This round trip does two things: (a) gets updates to loaded states as above (sideloaded) (because it can) and (b) attempts to get the state that corresponds to the url that is not yet handled.  (It does (a) because one of the loaded states might have a different URL that would match)  When/if such a state is located by the server, the server decides, based on "lazy" attributes, whether to include child states in the response.  The client merges the returned routes and then re-runs the routing, this time with a flag to fallback instead of hitting the server.  (The next time the route is requested, the client will already know about it.)
* **lazy attribute** -- in addition to the ui-router parameters, each state will have a "lazy" attribute, defaulting to false, which indidates whether or not it should be given to the client by default.  If a state is marked lazy, it is only fetched on demand (i.e. when the server determines that its url matches one that was passed from the client as unknown).  It such a state has non-lazy children, they are loaded, too  Otherwise, the children remain undefined until they are requested, etc. etc.
* **new states** -- a state defined to the server will be known to the client through the same mechanism as a lazy state.
* **the server** -- the server is responsible for delivering JSON that represents arbitrary subsets of the entire state tree.  Such subsets may be selected based on (a) a timestamp representing the last modification of the state tree known to the client; (b) a specific URL that the client needs to handle; and (c) arbitrary application defined parameters, which might include a "userName" or "isLoggedIn" parameter if states *need* to be user-specific.  The application is ultimately responsible for providing a jQuery-based service that will retrieve data from the server, however, *detour* will provide the vast majority of the JSON parameters for such requests (all but (c) above), and *detour* will be responsible for handling the returned JSON in order to merge it into the local tree.

#### Implementation
* **angular-ui/ui-router**: It is anticipated that detour will use [```angular-ui/ui-router``` project](http://github.com/angular-ui/ui-router) as a basis, but the modifications and additions will be significant enough to merit a separate project.  It will thus require manual merging of relevant updates to ui-router.  It would thus not be a fork of ui-router.  This plan is subject to change as implementation continues.
