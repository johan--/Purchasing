
var lookups = null,
    fixtures = null;

(function(){

lookups = {
  container: function(){
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

  path: function(){
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

fixtures = {
  updateOneFixture: function(model, id, data) {
    var store = lookups.store(),
        attributes = Ember.merge({ id: id }, data);

    Ember.run(function() {
      store.update(model, attributes);
    });
  },

  // This uses a different approach than update one
  updateAllFixtures: function(model, setData) {
    var fixtures = Ember.A(model.FIXTURES),
        store = lookups.store();

    if (Ember.isEmpty(fixtures))
      return;

    Ember.run(function(){
      // Since we're in a run loop we can update the fixture data directly
      fixtures.forEach(function(item){
        Ember.merge(item, setData);
      });
    });
  },

  reset: function() {
    var models = ['Account',
                  'Attachment',
                  'LineItem',
                  'Note',
                  'PurchaseToTag',
                  'Purchase',
                  'ReceivingLine',
                  'Receiving',
                  'Tag',
                  'CannedMessage',
                  'User',
                  'Vendor'],
        store = lookups.store();

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
    var model = lookups.currentModel(),
        purId = model.get('id'),
        store = lookups.store();

    return Ember.run(function(){
      id = id || getNextIdFrom('lineItem');

      var newLine = store.push('lineItem', { id: id, description: 'a test line', quantity: quantity || 5, purchase: purId });
      model.get('lineItems').pushObject(newLine);

      return newLine;
    });
  },

  createNote: function(id, text){
    var model = lookups.currentModel(),
        purId = model.get('id'),
        store = lookups.store(),
        noteText = text || 'a test line';

    return Ember.run(function(){
      id = id || getNextIdFrom('note');

      var newNote = store.push('note', { id: id, text: noteText, purchase: purId });
      model.get('notes').pushObject(newNote);

      return newNote;
    });
  },

  createReceiving: function(lineItem, count){
    var model = lookups.currentModel(),
        store = lookups.store();
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
  var store = lookups.store(),
      length = store.all(model).get('content.length') || 0;
  return length + 1;
}

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

Ember.Test.registerAsyncHelper('change', change);

Ember.Test.registerAsyncHelper('focusOut', focusOut);

App.injectTestHelpers();

})();
