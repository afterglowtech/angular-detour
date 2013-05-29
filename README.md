# angular-detour

* implements a StatesTree-version of ui-router
* allows runtime editing of configuration
* supports merging json representations of routing definitions as initial configurations and as updates
* allows templateProviders and resolve functions to be specified as named services
* in the future, will support lazy-loading/updating definitions from a server through AJAX
* derivation of [ui-router](https://github.com/angular-ui/ui-router)

**See the README in the [sample apps](https://github.com/afterglowtech/angular-detour/tree/master/samples) for basic demonstrations.**

*key changes from ui-router*
* StatesTree -- nodes implement the functionality of building states that ui-router contains in its states function
* folds urlRouter into the detourProvider (nee stateProvider) so that it can manage URL rules as "aliases"
* wraps couchPotato to lazy-load/define component dependencies of states (in the current sample the only lazy components are controllers)
* exposes configurability at runtime
* json interface

#### Implementation

Integration points with ui-router are up in the air as that project progresses.  At this time, updates to ui-router are being tracked manually.

### History/Attribution

detour is a derivation of ui-router (https://github.com/angular-ui/ui-router).

### License

See the [LICENSE file](https://github.com/afterglowtech/angular-detour/blob/master/LICENSE).

### Questions/Comments/Concerns

See the [Issues List](https://github.com/afterglowtech/angular-detour/issues).
