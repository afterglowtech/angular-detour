define(['./common', 'UrlMatcher'], function(common, UrlMatcher) {
  var abstractVar = 'abstract'
  ;

  function StateBase() {
    this.children = {};
  }


  //*********************************************
  // initialize
  //*********************************************
  Object.defineProperty(StateBase.prototype, 'self', {
    get: function() { return this; }
  });

  StateBase.prototype.resetAll = function() {
    this.resetFullName();
    this.resetUrl();
    this.resetParams();
    this.resetNavigable();
    this.resetPath();
    this.resetViews();
    this.resetIncludes();
    this.resetHandlers();
  };

  StateBase.prototype.initialize = function(forceInit) {
    if (this.needsInit || forceInit) {
      this.resetAll();

      for (var child in this.children) {
        this.children[child].initialize(true);
      }
      this.needsInit = false;
    }
  };

  //*********************************************
  // name/fullName/localName
  //*********************************************
  Object.defineProperty(StateBase.prototype, 'fullName', {
    get: function() { return this._fullName; }
  });
  Object.defineProperty(StateBase.prototype, 'name', {
    get: function() { return this._fullName; }
  });
  Object.defineProperty(StateBase.prototype, 'localName', {
    get: function() { return this._localName; },
    set: function(val) {
      this.validateName(val);
      this._localName= val;
      this.needsInit = true;
    }
  });

  StateBase.prototype.resetFullName = function() {
    this._fullName = (this.parent.fullName)
      ? this.parent.fullName + '.' + this.localName
      : this.localName;
  };
  StateBase.prototype.toString = function() { return this.fullName; };

  StateBase.prototype.validateName = function(localName) {
    if (!common.isString(localName) || localName.indexOf('@') >= 0) {
      throw new Error('Invalid local state name (' + localName + ')');
    }

    // can't redefine if we throw this error here
    //not really useful, anyway
    // if (this.parent && this.parent.getChild(localName)) {
    //     throw new Error('State ' + parent.fullName  + ' already has child ' + localName);
    // }
  };

  //*********************************************
  // root
  //*********************************************
  Object.defineProperty(StateBase.prototype, 'root', {
    get: function() { return this.parent.root; }
  });

  //*********************************************
  // children
  //*********************************************
  Object.defineProperty(StateBase.prototype, 'children', {
    get: function() { return this._children; },
    set: function(val) {
      this._children = val;
      if (this._children) {
        for (var child in this._children) {
          //assigning their parent takes care of resetting the children
          this._children[child].parent = this;
        }
      }
    }
  });

  //*********************************************
  // path
  //*********************************************
  StateBase.prototype.resetPath = function() {
    // Keep a full path from the root down to this state as this is needed for state activation.
    this.path = this.parent.path.concat(this); // exclude root from path
  };

  //*********************************************
  // url
  //*********************************************
  Object.defineProperty(StateBase.prototype, 'url', {
    get: function() { return this._url; },
    set: function(val) {
      this._url= val;
      this.needsInit = true;
    }
  });
  Object.defineProperty(StateBase.prototype, 'aliases', {
    get: function() { return this._aliases; },
    set: function(val) {
      this._aliases= val;
      this.needsInit = true;
    }
  });


  StateBase.prototype.resetUrl = function() {
    /*jshint eqeqeq:false */
    this.preparedUrl = null;
    if (common.isString(this.url)) {
      if (this.url.charAt(0) === '^') {
        this.preparedUrl = new UrlMatcher(this.url.substring(1));
      } else {
        this.preparedUrl = (this.parent.navigable || this.root).preparedUrl.concat(this.url);
      }
    } else if (common.isObject(this.url) &&
        common.isFunction(this.url.exec) && common.isFunction(this.url.format) && common.isFunction(this.url.concat)) {
          this.preparedUrl = this.url;
      /* use UrlMatcher (or compatible object) as is */
    } else if (this.url != null) {
      throw new Error('Invalid url ' + this.url + ' in state ' + this);
    }

  };

  //*********************************************
  // params
  //*********************************************
  Object.defineProperty(StateBase.prototype, 'params', {
    get: function() { return this._params; },
    set: function(val) {
      this._params= val;
      this.needsInit = true;
    }
  });
  StateBase.prototype.resetParams = function() {
    // Derive parameters for this state and ensure they're a super-set of parent's parameters
    this.preparedParams = null;

    // Derive parameters for this state and ensure they're a super-set of parent's parameters
    var params = this.params;
    if (params) {
      if (!common.isArray(params)) {
        throw new Error('Invalid params in state \'' + this + '\'');
      }
      else {
        if (this.preparedUrl) {
          throw new Error('Both params and url specicified in state \'' + this + '\'');
        }
        else {
          this.perparedParams = params;
        }
      }
    }
    else {
      this.preparedParams = this.preparedUrl ? this.preparedUrl.parameters() : this.parent.preparedParams;
    }

    var paramNames = {};
    common.forEach(this.preparedParams, function (p) {
      paramNames[p] = true;
    });
    if (this.parent) {
      var that = this;
      common.forEach(this.parent.preparedParams, function (p) {
        if (!paramNames[p]) {
          throw new Error('Missing required parameter \'' + p + '\' in state \'' + that.name + '\'');
        }
        paramNames[p] = false;
      });

      var ownParams = this.ownParams = [];
      common.forEach(paramNames, function (own, p) {
        if (own) {
          ownParams.push(p);
        }
      });
    } else {
      this.ownParams = this.preparedParams;
    }
  };

  //*********************************************
  // navigable
  //*********************************************
  StateBase.prototype.resetNavigable = function() {
    this.navigable = (this.url)
      ? this
      : (this.parent)
        ? this.parent.navigable
        : null;
  };

  //*********************************************
  // abstract
  //*********************************************
  Object.defineProperty(StateBase.prototype, abstractVar, {
    get: function() { return this._abstract; },
    set: function(val) {
      this._abstract= val;
      this.needsInit = true;
    }
  });

  //*********************************************
  // includes
  //*********************************************
  StateBase.prototype.resetIncludes = function() {
    // Speed up $detour.contains() as it's used a lot
    this.includes = (this.parent)
      ? common.extend({}, this.parent.includes)
      : {};
    this.includes[this.name] = true;
  };

  //*********************************************
  // views
  //*********************************************
  Object.defineProperty(StateBase.prototype, 'views', {
    get: function() { return this._views; },
    set: function(val) {
      this._views= val;
      this.needsInit = true;
    }
  });
  StateBase.prototype.resetViews = function() {
    var state = this;
    // If there is no explicit multi-view configuration, make one up so we don't have
    // to handle both cases in the view directive later. Note that having an explicit
    // 'views' property will mean the default unnamed view properties are ignored. This
    // is also a good time to resolve view names to absolute names, so everything is a
    // straight lookup at link time.
    var views = {};
    var myViews = this.views;
    common.forEach(common.isDefined(myViews) ? myViews : { '': state }, function (view, name) {
      if (name.indexOf('@') < 0) {
        name = name + '@' + state.parent.name;
      }
      views[name] = view;
    });
    this.preparedViews = views;
  };

  //this is somewhat particular to client-side
  //for now, separate -- but revisit this when
  //implementing incremental matching
  // //*********************************************
  // // handleUrl
  // //*********************************************
  // StateBase.prototype._buildRule = function(what, handler) {
  //   var rule, redirect;
  //   if (isString(what)) {
  //     what = new UrlMatcher(what);
  //   }

  //   if (what instanceof UrlMatcher) {
  //     if (isString(handler)) {
  //       redirect = new UrlMatcher(handler);
  //       handler = [matchSvc, function ($match) { return redirect.format($match); }];
  //     }
  //     else if (!isFunction(handler) && !isArray(handler)) {
  //       throw new Error('invalid \'handler\' in when()');
  //     }

  //     rule = function ($injector, $location) {
  //       return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
  //     };
  //     rule.prefix = isString(what.prefix) ? what.prefix : '';
  //   }
  //   else if (what instanceof RegExp) {
  //     if (isString(handler)) {
  //       redirect = handler;
  //       handler = [matchSvc, function ($match) { return interpolate(redirect, $match); }];
  //     }
  //     else if (!isFunction(handler) && !isArray(handler)) {
  //       throw new Error('invalid \'handler\' in when()');
  //     }

  //     if (what.global || what.sticky) {
  //       throw new Error('when() RegExp must not be global or sticky');
  //     }

  //     rule = function ($injector, $location) {
  //       return handleIfMatch($injector, handler, what.exec($location.path()));
  //     };
  //     rule.prefix = regExpPrefix(what);
  //   }
  //   else {
  //     throw new Error('invalid \'what\' in when()');
  //   }
  //   return rule;
  // };

  StateBase.prototype.resetHandlers = function() {
    //this implementation is client-specific
    throw new Error('not implemented: "resetHandlers"');
    // if (this[abstractVar] || !this.preparedUrl) {
    //   this.handleUrl = null;
    //   return;
    // }

    // var what = this.preparedUrl;
    // var that = this;
    // var handler = [matchSvc, detourSvc, function ($match, $detour) {
    //   $detour.transitionTo(that, $match, false);
    // }];

    // this.handleUrl = this._buildRule(what, handler);

    // this.preparedAliases = [];
    // if (this.aliases) {
    //   common.forEach(this.aliases, function(value, key) {
    //     value = value.charAt(0) === '^'
    //       ? value.substring(1)
    //       : (that.parent.navigable || that.root).preparedUrl.concat(value).source;
    //     that.preparedAliases.push(that._buildRule(key, value));
    //   });
    // }

  };

  // StateBase.prototype.tryHandle = function($injector, $location) {
  //   //this implementation is client-specific
  //   throw new Error('not implemented: "resetHandlers"');
  //   var handled = false;

  //   if (this.handleUrl) {
  //     handled = this.handleUrl($injector, $location);
  //     for (var i = 0; i < this.preparedAliases.length && !handled; i++) {
  //       handled = this.preparedAliases[i]($injector, $location);
  //     }
  //   }

  //   if (!handled) {
  //     for (var child in this.children) {
  //       handled = this.children[child].tryHandle($injector, $location);
  //       if (handled) {
  //         break;
  //       }
  //     }
  //   }

  //   return handled;
  // };


  StateBase.prototype.newInstance = function() {
    return new StateBase();
  };

  //*********************************************
  // getChild
  //*********************************************
  StateBase.prototype.getChild = function(localName) {
    return (this.children)
      ? this.children[localName]
      : null;
  };


  //*********************************************
  // setChild
  //*********************************************
  //this redefines the child in place (i.e. doesn't wipe out its children)
  StateBase.prototype.setChild = function(stateDef, deep) {
    var state = this.newInstance();
    common.extend(state, stateDef);

    return this.setChildState(state, deep);
  };

  //*********************************************
  // removeChild
  //*********************************************
  //undefines the child (and any descendants of the child)
  StateBase.prototype.removeChild = function(localName) {
    if (this.children[localName]) {
      delete this.children[localName];
    }
    //this._needsInit = true;
    return this;
  };


  //*********************************************
  // setChildState
  //*********************************************
  //this redefines the child in place (i.e. doesn't wipe out its children)
  StateBase.prototype.setChildState = function(state, deep) {
    if (!deep) {
      var existingChild = this.getChild(state.localName);
      var existingChildren = (existingChild)
        ? existingChild.children
        : null;

      if (existingChildren) {
        state._children = existingChildren;
      }

    }

    this.children[state.localName] = state;
    state.parent = this;
    this.needsInit = true;
    return state;
  };


  //*********************************************
  // updateChild
  //*********************************************
  //this updates properties of the child in place (i.e. doesn't wipe out its children)
  //nor does it start with a fresh state, so properties not overwritten are maintained
  //however, if no existing state, a new one is created
  StateBase.prototype.updateChild = function(stateDef) {
    var state = this.getChild(stateDef.localName);
    if (!state) {
      // deep doesn't really matter since this will be a new state, but
      // for form it's set to true
      return this.setChild(stateDef, true);
    }
    else {
      common.extend(state, stateDef);

      return this.setChildState(state, false);
    }
  };

  //*********************************************
  // prepareFlatDefinition
  //*********************************************
  StateBase.prototype.prepFlatGetParent = function(stateDef) {
    var parent, localName;
    if (stateDef.parent) {
      parent = this.getState(stateDef.parent);
      localName = stateDef.fullName;
    }
    else
    {
      var fullName = stateDef.fullName
        ? stateDef.fullName
        : stateDef.name;

      var parts = /^(.*?)\.?([^\.]*)$/.exec(fullName);

      var parentName = parts[1];
      localName = parts[2];

      parent = parentName
        ? this.getState(parentName)
        : this.root;
    }

    stateDef.localName = localName;

    delete stateDef.name;
    delete stateDef.fullName;
    delete stateDef.parent;

    return parent;
  };


  //*********************************************
  // setState
  //*********************************************
  //specify name/fullName in the definition to indicate
  //parent (which must already exist) -- for compatibility
  //with ui-router or other non-oo definition style
  StateBase.prototype.setState = function(stateDef, deep) {
    var parent = this.prepFlatGetParent(stateDef);

    return parent.setChild(stateDef, deep);
  };

  //*********************************************
  // updateState
  //*********************************************
  //specify name/fullName in the definition to indicate
  //parent (which must already exist) -- for compatibility
  //with ui-router or other non-oo definition style
  StateBase.prototype.updateState = function(stateDef) {
    var parent = this.prepFlatGetParent(stateDef);

    return parent.updateChild(stateDef);
  };

  //*********************************************
  // findState
  //*********************************************
  StateBase.prototype.findState = function(partialName) {
    var parts = /^([^\.]+)(\.(.*))?$/.exec(partialName);
    var firstPart = parts[1];
    if (this.localName === firstPart)
    {
      //first part matches this node
      //grab the rest of the name
      var rest = parts[3];
      if (rest) {
        return this.findStateChildren(rest);
      }
      else {
        //there is no 'rest' -- we've found the state
        return this;
      }
    }
    else {
      //this is not a path for this partialName
      return null;
    }
  };

  //*********************************************
  // findStateChildren
  //*********************************************
  StateBase.prototype.findStateChildren = function(partialName) {
    if (this.children) {
      for (var child in this.children) {
        var found = this.children[child].findState(partialName);
        if (found) {
          return found;
        }
      }
    }
    //nothing was found
    return null;
  };

  //*********************************************
  // getState
  //*********************************************
  StateBase.prototype.getState = function(state) {
    if (!common.isString(state)) {
      return this.root.findStateChildren(state.fullName);
    }
    else {
      return this.root.findStateChildren(state);
    }
  };

  //*********************************************
  // JSON support
  //*********************************************
  StateBase.prototype.getIntJson = function(object, longPropertyName, shortPropertyName) {
    return object[shortPropertyName]
      ? parseInt(object[shortPropertyName], 10)
      : object[longPropertyName]
        ? parseInt(object[longPropertyName], 10)
        : null;
  };

  StateBase.prototype.getObjJson = function(object, longPropertyName, shortPropertyName) {
    return object[shortPropertyName]
      ? object[shortPropertyName]
      : object[longPropertyName]
        ? object[longPropertyName]
        : null;
  };

  StateBase.prototype.expandDefinition = function(definition) {
    this.expandJson(definition, 'url', 'u');
    this.expandJson(definition, 'dependencies', 'd');
    this.expandJson(definition, 'resolveByService', 'r');
    this.expandJson(definition, 'templateService', 'i');
    this.expandJson(definition, 'aliases', 's');
    this.expandJson(definition, 'controller', 'c');
    this.expandJson(definition, 'templateUrl', 't');
    this.expandJson(definition, 'template', 'l');
    this.expandJson(definition, 'data', 'a');
    this.expandJson(definition, 'abstract', 'b');
    this.expandJson(definition, 'views', 'v');
  };

  StateBase.prototype.expandView = function(view) {
    this.expandJson(view, 'url', 'u');
    this.expandJson(view, 'resolveByService', 'r');
    this.expandJson(view, 'templateService', 'i');
    this.expandJson(view, 'controller', 'c');
    this.expandJson(view, 'templateUrl', 't');
    this.expandJson(view, 'template', 'l');
    this.expandJson(view, 'data', 'a');
  };

  StateBase.prototype.expandJson = function(object, longPropertyName, shortPropertyName) {
    if (object[shortPropertyName]) {
      object[longPropertyName] = object[shortPropertyName];
      delete object[shortPropertyName];
    }
  };

  StateBase.prototype.mergeChild = function(name, childJson) {
    //the name of the child we're working with
    var del = this.getObjJson(childJson, 'delete', 'x');
    if (del) {
      this.removeChild(name);
    }
    else
    {
      var definition = this.getObjJson(childJson, 'definition', 'd');
      if (definition) {
        //a definition is specified -- update child
        definition.localName = name;
        this.expandDefinition(definition);
        if (definition.views) {
          for (var viewName in definition.views) {
            var view = definition.views[viewName];
            this.expandView(view);
          }
        }

        this.updateChild(definition);
      }

      var children = this.getObjJson(childJson, 'children', 'c');
      if (children) {
        var thisChild = this.getChild(name);
        for (var grandchildName in children) {
          var grandChild = children[grandchildName];
          thisChild.mergeChild(grandchildName, grandChild);
        }
      }
    }

    return true;
  };

  Object.defineProperty(StateBase.prototype, 'knownStates', {
    get: function() {
      var summary = {};

      if (Object.keys(this.children).length > 0) {
        var children = {};
        for (var childName in this.children) {
          var child = this.children[childName];
          children[child.localName] = child.knownStates;
        }
        summary = children;
      }

      return summary;
    }
  });

  return StateBase;

});
