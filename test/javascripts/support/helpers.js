
var lookups = null,
    fixtures = null;

(function(){

lookups = {
  container: function(){
    return App.__container__;
  },

  route: function(app, name){
    if (Ember.isEmpty(name))
      return lookups.currentlookupRoute();
    else
      return lookups.container().lookup('route:' + name);
  },

  controller: function(app, name){
    return lookups.container().lookup('controller:' + name);
  },

  path: function(){
    return lookupController('application').get('currentPath');
  },

  store: function() {
    return lookupController('application').get('store');
  },

  currentRoute: function() {
    // http://jsfiddle.net/slindberg/EPGDp/3/
    var pathParts = path().split('.'),
        routeName = pathParts.slice(pathParts.length - 2).join('.');
    return lookups.container().lookup('route:' + routeName);
  },

  currentModel: function() {
    return lookups.currentRoute().get('currentModel');
  },

  metadata: function(app, model) {
    return lookupStore().metadataFor(model);
  },

  queryParamsFor: function(app, model) {
    return lookups.container().lookup('route:' + model).get('queryParams');
  }
};

fixtures = {
  updateTestFixtures: function(app, model, setData) {
    var fixtures = Ember.A(model.FIXTURES),
        store = lookupStore();

    if (Ember.isEmpty(fixtures))
      return;

    Ember.run(function(){
      // Since we're in a run loop we can update the fixture data directly
      fixtures.forEach(function(item){
        Ember.merge(item, setData);
      });
    });
  },

  injectFixtures: function() {
    var models = ['Account',
                  'Attachment',
                  'LineItem',
                  'Note',
                  'PurchaseToTag',
                  'Purchase',
                  'ReceivingLine',
                  'Receiving',
                  'Tag',
                  'User',
                  'Vendor'];

    // Use Deep copy so BASE remains intact
    $.each(models, function(index, model){
      App[model].FIXTURES = Ember.copy(App[model].FIXTURES_BASE, true);
    });
    META_FIXTURE = Ember.copy(META_FIXTURE_BASE, true);

    Ember.run(function(){
      App.current_user.set('roles', ['admin']);
    });
  },

  createLine: function(id, quantity){
    var model = currentModel(),
        purId = model.get('id'),
        store = lookupStore();

    return Ember.run(function(){
      id = id || getNextIdFrom('lineItem');

      var newLine = store.push('lineItem', { id: id, description: 'a test line', quantity: quantity || 5, purchase: purId });
      model.get('lineItems').pushObject(newLine);

      return newLine;
    });
  },

  createNote: function(id){
    var model = currentModel(),
        purId = model.get('id'),
        store = lookupStore();

    return Ember.run(function(){
      id = id || getNextIdFrom('note');

      var newNote = store.push('note', { id: id, name: 'a test line', purchase: purId });
      model.get('notes').pushObject(newNote);

      return newNote;
    });
  },

  createReceiving: function(lineItem, count){
    var model = currentModel(),
        store = lookupStore();
    var purId = model.get('id'),
        lineId = (lineItem) ? lineItem.get('id') : null,
        receivingId = getNextIdFrom('receiving'),
        receivingLineId = getNextIdFrom('receivingLine');

    return Ember.run(function(){
      var newReceiving = store.push('receiving', { id: receivingId, purchase: purId, receivingLines: [receivingLineId], total: 1 });
      var newReceivingLine = store.push('receivingLine', { id: receivingLineId, quantity: count || 5,
                                    lineItem: lineId,
                                    receiving: receivingId });
      model.get('receivings').pushObject(newReceiving);
      if (lineItem)
        lineItem.get('receivingLines').pushObject(newReceivingLine);

      return newReceiving;
    });
  }
};

function getNextIdFrom(model){
  var store = lookupStore(),
      length = store.all(model).get('content.length') || 0;
  return length + 1;
}

})();


// QUnit helpers
function exists(actual, message) {
  var el = isEmpty(find(actual));

  QUnit.push(el !== true, el, true, message );
}

function notExists(actual, message) {
  var el = isEmpty(find(actual));

  QUnit.push(el === true, el, true, message );
}

function isVisible(actual, message) {
  var el = find(actual).is(':visible');

  QUnit.push(el === true, el, true, message );
}

function isHidden(actual, message) {
  var el = find(actual);

  if (Ember.isEmpty(el))
    QUnit.push(true, el, true, message );
  else
    QUnit.push(el.is(':hidden') === true, el.is(':hidden'), true, message );
}

function contains(actual, expected, message) {
  if (!Ember.canInvoke(actual, 'indexOf'))
    throw('Object does not appear to be a string');
  QUnit.push(actual.indexOf(expected) > -1, actual, expected, message);
}
function notContains(actual, expected, message) {
  if (!Ember.canInvoke(actual, 'indexOf'))
    throw('Object does not appear to be a string');
  QUnit.push(actual.indexOf(expected) === -1, actual, expected, message);
}


// Ember Helpers
(function(){

function focusOut(app, selector, context) {
  var $el;
  $el = findWithAssert(app, selector, context);
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

Ember.Test.registerHelper('path', lookups.path);

Ember.Test.registerHelper('getMetadataFor', lookups.metadata);

Ember.Test.registerHelper('lookupStore', lookups.store);

Ember.Test.registerHelper('currentModel', lookups.currentModel);

Ember.Test.registerHelper('lookupController', lookups.controller);

Ember.Test.registerHelper('lookupRoute', lookups.route);

Ember.Test.registerHelper('getQueryParamsFor', lookups.queryParamsFor);

Ember.Test.registerHelper('updateTestFixtures', fixtures.updateTestFixtures);

Ember.Test.registerHelper('injectFixtures', fixtures.injectFixtures);

Ember.Test.registerAsyncHelper('mouseOver', mouseOver);

Ember.Test.registerAsyncHelper('change', change);

Ember.Test.registerAsyncHelper('focusOut', focusOut);

App.injectTestHelpers();

})();
