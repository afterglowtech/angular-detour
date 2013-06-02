var fs = require('fs');
var express = require('express');
var app = express();
app.use(express.bodyParser());
var UrlMatcher = require('./server-files/urlMatcher.js');
var defaultStatesFile = './server-files/sample-routes.json';
var statesByName = {};
var statesDefinition = null;
var littleStates = null;

function jsonConvertOne(object, longPropertyName, shortPropertyName, expand) {
  //default is to contract
  expand = typeof expand !== 'undefined' ? expand : false;
  if (expand) {
    var temp = longPropertyName;
    longPropertyName = shortPropertyName;
    shortPropertyName = temp;
  }

  if (object[longPropertyName]) {
    object[shortPropertyName] = object[longPropertyName];
    delete object[longPropertyName];
  }
}

//default is contract
function jsonConvert(state, expand) {
  jsonConvertOne(state, 'lazy', 'z', expand);
  jsonConvertOne(state, 'delete', 'x', expand);
  jsonConvertOne(state, 'definition', 'd', expand);
  var definition = state.definition || state.d;

  jsonConvertOne(definition, 'url', 'u', expand);
  jsonConvertOne(definition, 'dependencies', 'd', expand);
  jsonConvertOne(definition, 'resolveByService', 'r', expand);
  jsonConvertOne(definition, 'templateService', 'i', expand);
  jsonConvertOne(definition, 'aliases', 's', expand);
  jsonConvertOne(definition, 'controller', 'c', expand);
  jsonConvertOne(definition, 'templateUrl', 't', expand);
  jsonConvertOne(definition, 'template', 'l', expand);
  jsonConvertOne(definition, 'data', 'a', expand);
  jsonConvertOne(definition, 'abstract, ', 'b', expand);
  jsonConvertOne(definition, 'views', 'v', expand);

  var views = definition.views || definition.v;
  if (views) {
    for (var viewName in views) {
      var view = views[viewName];
      jsonConvertOne(view, 'url', 'u', expand);
      jsonConvertOne(view, 'resolveByService', 'r', expand);
      jsonConvertOne(view, 'templateService', 'i', expand);
      jsonConvertOne(view, 'controller', 'c', expand);
      jsonConvertOne(view, 'templateUrl', 't', expand);
      jsonConvertOne(view, 'template', 'l', expand);
      jsonConvertOne(view, 'data', 'a', expand);
    }
  }

  jsonConvertOne(state, 'children', 'c', expand);
  var children = state.children || state.c;
  if (children) {
    for (var childName in children) {
      var child = children[childName];
      jsonConvert(child, expand);
    }
  }
}

function cleanLittleState(state) {
  delete state.z;
  var children = state.c;
  if (children) {
    for (var childName in children) {
      cleanLittleState(children[childName]);
    }
  }
}

function initializeStateChild(root, parent, child, childName, statesByName) {
  //not-so-quick but dirty way to get a minified copy of the child
  //this is what gets assembled and sent back to clients
  var preventRecurse = true;
  var expand = false;
  //temporarily disconnect children to clone just this child
  var holdChildren = child.children;
  delete child.children;
  var childClone = JSON.parse(JSON.stringify(child));
  child.children = holdChildren;
  //minify and clean the cloned child
  jsonConvert(childClone, expand);
  cleanLittleState(childClone);
  child.littleState = childClone;

  //prepare the big child
  child.name = childName;
  child.parent = parent;
  if (parent) {
    child.lazy = child.lazy || parent.lazy;
  }
  if (parent && parent.fullName) {
    child.fullName = parent.fullName + '.' + childName;
  }
  else {
    child.fullName = childName;
  }

  statesByName[child.fullName] = child;

  child.navigable = typeof child.definition.url !== 'undefined'
    ? child
    : child.parent
      ? child.parent.navigable
      : null;

  var url = child.definition.url;
  child.urlMatchers = [];

  if (typeof url !== 'undefined') {
    if (url.charAt(0) === '^') {
      child.urlMatchers.push(new UrlMatcher(url.substring(1)));
    } else {
      child.urlMatchers.push(((parent && parent.navigable) || root).urlMatchers[0].concat(url));
    }
  }

  for (var alias in child.definition.aliases) {
    child.urlMatchers.push(new UrlMatcher(alias, true));
  }

  if (child.children) {
    for (var grandchildName in child.children) {
      var grandchild = child.children[grandchildName];
      initializeStateChild(root, child, grandchild, grandchildName, statesByName);
    }
  }
}

function loadStates(statesFile) {
  var expand = true;
  var contract = false;

  statesDefinition = JSON.parse(fs.readFileSync(statesFile, 'utf8'));
  jsonConvertOne(statesDefinition, 'tree', 't', expand);
  jsonConvertOne(statesDefinition, 'fallback', 'f', expand);
  jsonConvertOne(statesDefinition, 'serial', 's', expand);

  statesDefinition.urlMatchers = [new UrlMatcher('')];

  littleStates = {
    t: statesDefinition.tree,
    f: statesDefinition.fallback,
    s: statesDefinition.serial
  };

  var tree = statesDefinition.tree;
  for (var childName in tree) {
    var child = tree[childName];
    jsonConvert(child, expand);
    initializeStateChild(statesDefinition, null, child, childName, statesByName);
  }
}

function getStateForRoute(children, route) {
  var matchState = null;
  for (var childName in children) {
    var child = children[childName];
    if (child.urlMatchers) {
      for (var i = 0; i < child.urlMatchers.length; i++) {
        var urlMatcher = child.urlMatchers[i];
        if (urlMatcher.exec(route)) {
          if (child.definition['abstract']) {
            matchState = getStateForRoute(child.children, route);
            if (matchState) {
              return matchState;
            }
          }
          else {
            return child;
          }
        }
      }
    }
    if (child.children) {
      matchState = getStateForRoute(child.children, route);
      if (matchState) {
        return matchState;
      }
    }
  }
  return null;
}

//e.g. 'a.c.x.y', {a:{c:{c:{c:{x:{c{y:{c:{z}}}}}}, b:{c:{}}, d:{z:true}},{a:{c:{}}}, {}
//we specifically want a.c.x.y;
//we're just getting started, so the workingState is the root
//we know about a.c
//we are looking at the whole tree definition
//there is so far an empty response
//set response to {a:{c:{c:{c:{x:{d:{},c:{y:{d:{}}}}}},b:{c:{}}}
//
function buildResponse(specificState, state, states, knownState, serialMin, serialMax, response) {
  var childrenResponse = {};
  for (var childStateName in states) {
    var child = states[childStateName];
    var knownChild = null;
    if (knownState) {
       knownChild = knownState[childStateName];
      //keep track of states that we find in the definitions under the state
      //object -- anything not under state (and hence remaining in the
      //under knownstate) will result in a delete instruction in the json
      //constructed below
      delete knownState[childStateName];
    }

    if (child || knownChild) {
      buildResponse(specificState, child, child ? child.children : null, knownChild, serialMin, serialMax, childrenResponse);
    }
  }

  var childrenResponseNonEmpty = Object.keys(childrenResponse).length > 0;

  //delete the states that are known but not defined
  for (var missingStateName in knownState) {
    response[missingStateName] = {x: true};
  }

  if (state) {
    //at the very least include a summary if there are children to respond with
    var includeSummary = childrenResponseNonEmpty;
    //definition will be included if tests below indicate
    var includeDefinition = false;
    if (knownState && knownState[state.name]) {
      //client knows about this state -- is it up to date?
      serial = state.serial;
      var serialPush =
        serial && (serialMin || serialMax) //serial is required for updates
        &&
        (
          (!serialMin || (serial >= serialMin))
          &&
          (!serialMax || (serial <= serialMax))
        )
      ;

      includeDefinition = includeDefinition || serialPush;
    }
    else {
      //not known
      // include the definition if the state is not lazy
      // or there are children to send back
      // or this is the specific state
      includeDefinition = includeSummary || !state.lazy || state === specificState;
    }

    if (includeDefinition) {
      response[state.name] = state.littleState;
      if (childrenResponseNonEmpty) {
        response[state.name].c = childrenResponse;
      }
    }
    else {
      if (includeSummary) {
        response[state.name] = {};
        response[state.name].c = childrenResponse;
      }
    }
  }
  else {
    for (var responseChildName in childrenResponse) {
      response[responseChildName] = childrenResponse[responseChildName];
    }
  }
}

function getRoute(routeRequest, knownStates) {
  var response = {
    t: {},
    s: littleStates.s
  };

  if (knownStates.f !== littleStates.f) {
    response.f = littleStates.f;
  }
  //TODO: need to deal with the fallback somehow (or not)
  var matchState = getStateForRoute(statesDefinition.tree, routeRequest);

  buildResponse(matchState, null, statesDefinition.tree, knownStates.t, null, null, response.t);

  return response;
}

function getState(stateName, knownStates) {
  var response = {
    t: {},
    f: littleStates.f,
    s: littleStates.s
  };
  //TODO: need to deal with the fallback somehow (or not)
  var matchState = statesByName[stateName];

  buildResponse(matchState, null, statesDefinition.tree, knownStates.t, null, null, response.t);

  return response;
}

loadStates(defaultStatesFile);

app.use('/js', express.static(__dirname + '/js'));
app.use('/dist', express.static(__dirname + '/../../dist'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/partials', express.static(__dirname + '/partials'));

app.get('/svc/getRoute', function(req, res, next) {
  var ks = JSON.parse(req.query.k);
  res.json(getRoute(req.query.r, ks));
});

app.get('/svc/getState', function(req, res, next) {
  var ks = JSON.parse(req.query.k);
  res.json(getState(req.query.s, ks));
});

app.all('/*', function(req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: __dirname });
});

app.listen(3006); //the port you want to use
