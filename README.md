# angular-detour

* implements a StatesTree-version of ui-router
* allows runtime editing of configuration
* support for merging json representations of routing definitions
* allows templateProviders and resolve functions to be specified as named services
* in the future, will support lazy-loading/updating definitions from a server through AJAX
* derivation of [ui-router](https://github.com/angular-ui/ui-router)

To run the sample:
* clone the repository
* npm install
* grunt build
* node sample-server.js
* visit localhost:3006/ui-router-compatibility-sample and localhost:3006/runtime-configuration-sample and localhost:3006/json-config-sample

*key changes from ui-router*
* StatesTree -- nodes implement the functionality of building states that ui-router contains in its states function
* folds urlRouter into the detourProvider (nee stateProvider) so that it can manage URL rules as "aliases"
* wraps couchPotato to lazy-load/define component dependencies of states (in the current sample the only lazy components are controllers)
* exposes configurability at runtime

#### Implementation

Integration points with ui-router are up in the air as that project progresses.  Although there is no expectation, it is theoretically possible that in the future, ui-router could be factored such that it could be used without changes.  The keys to that would be:
* runtime editability of state definitions
* a callout prior to invoking the fallback state that would allow for a promise-based attempt to lazy-load a route that is not-yet defined to the client (this be easier to explain by example when it's ready)

### History/Attribution

detour is a derivation of ui-router (https://github.com/angular-ui/ui-router).

### License

See the [LICENSE file](https://github.com/afterglowtech/angular-detour/blob/master/LICENSE).

### Questions/Comments/Concerns

See the [Issues List](https://github.com/afterglowtech/angular-detour/issues).
