
var lookups = null;

(function() {

lookups = {
  container: function() {
    return App.__container__;
  },

  route: function(name){
    if (Ember.isEmpty(name))
      return this.route();
    else
      return this.container().lookup('route:' + name);
  },

  controller: function(name){
    return this.container().lookup('controller:' + name);
  },

  path: function() {
    return this.controller('application').get('currentPath');
  },

  store: function() {
    return this.controller('application').get('store');
  },

  currentRoute: function() {
    // http://jsfiddle.net/slindberg/EPGDp/3/
    var pathParts = this.path().split('.'),
        routeName = pathParts.slice(pathParts.length - 2).join('.');
    return this.container().lookup('route:' + routeName);
  },

  currentModel: function() {
    return this.currentRoute().get('currentModel');
  },

  metadata: function(model) {
    return this.store().metadataFor(model);
  },

  queryParamsFor: function(model) {
    return this.container().lookup('route:' + model).get('queryParams');
  }
};

})();


// QUnit helpers
function exists(actual, message) {
  var elExists = isEmpty(find(actual));

  QUnit.push(elExists !== true, elExists, true, message );
}

function notExists(actual, message) {
  var elExists = isEmpty(find(actual));

  QUnit.push(elExists === true, elExists, true, message );
}

function isVisible(actual, message) {
  var elIsVisible = find(actual).is(':visible');

  QUnit.push(elIsVisible === true, elIsVisible, true, message );
}

function isHidden(actual, message) {
  var el = find(actual);

  if (Ember.isEmpty(el))
    QUnit.push(true, el, true, message );
  else
    QUnit.push(el.is(':hidden') === true, el.is(':hidden'), true, message );
}

function isFocused(actual, message) {
  var el = find(actual),
      focused = $(document.activeElement);

  // All Ember elements have a unique ID
  QUnit.push(el.attr('id') === focused.attr('id'), actual, true, message);
}

function contains(actual, expected, message) {
  if (Ember.typeOf(actual) !== 'string')
    throw('Object does not appear to be a string');
  QUnit.push(actual.indexOf(expected) > -1, actual, expected, message);
}
function notContains(actual, expected, message) {
  if (Ember.typeOf(actual) !== 'string')
    throw('Object does not appear to be a string');
  QUnit.push(actual.indexOf(expected) === -1, actual, expected, message);
}


// Ember Helpers
(function() {

function focusOut(app, selector, context) {
  var $el = findWithAssert(app, selector, context);
  Ember.run(function() {
    $el.focusout().change();
  });
  return wait(app);
}

function mouseOver(app, selector, context) {
  var $el = findWithAssert(app, selector, context);
  Ember.run($el, 'mouseenter');
  return wait(app);
}

function mouseOut(app, selector, context) {
  var $el = findWithAssert(app, selector, context);
  Ember.run($el, 'mouseleave');
  return wait(app);
}

function mouseDown(app, selector, context) {
  var $el = findWithAssert(app, selector, context);
  Ember.run($el, 'mousedown');
  return wait(app);
}

function mouseUp(app, selector, context) {
  var $el = findWithAssert(app, selector, context);
  Ember.run($el, 'mouseup');
  return wait(app);
}

function change(app, selector, value, context) {
  var $el = findWithAssert(app, selector, context);
  $el.val(value);
  Ember.run($el, 'change');
  return wait(app);
}

// ember-testing/lib/helpers.js:120
function findWithAssert(app, selector, context) {
  var $el = find(app, selector, context);
  if ($el.length === 0) {
    throw new Ember.Error("Element " + selector + " not found.");
  }
  return $el;
}

// ember-testing/lib/helpers.js:128
function find(app, selector, context) {
  var $el;
  context = context || Ember.get(app, 'rootElement');
  $el = app.$(selector, context);

  return $el;
}

Ember.Test.registerAsyncHelper('mouseOver', mouseOver);

Ember.Test.registerAsyncHelper('mouseOut', mouseOut);

Ember.Test.registerAsyncHelper('mouseDown', mouseDown);

Ember.Test.registerAsyncHelper('mouseUp', mouseUp);

Ember.Test.registerAsyncHelper('change', change);

Ember.Test.registerAsyncHelper('focusOut', focusOut);

App.injectTestHelpers();

})();
