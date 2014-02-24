
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
    Ember.assert('No model name sent to updateOneFixture', !!model);
    Ember.assert('No id sent to updateOneFixture', !!id);
    Ember.assert('No data sent to updateOneFixture', !!id);

    var store = lookups.store(),
        attributes = Ember.merge({ id: id }, data);

    Ember.run(function() {
      // Update sends the _partial flag which forces an update instead of replace
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
    var purId = lookups.currentModel().get('id');

    return this.createObject(id, 'lineItem', { purchase: purId,
                                               description: 'a test line',
                                               quantity: quantity || 5 });
  },


  createReceiving: function(lineItem, count){
    var model = lookups.currentModel(),
        purId = model.get('id'),
        receivingId = getNextIdFrom('receiving'),
        receivingLineId = getNextIdFrom('receivingLine'),
        lineId = (lineItem) ? lineItem.get('id') : null;

    var newReceiving = this.createObject(receivingId,
                                         'receiving',
                                       { purchase: purId,
                                         receivingLines: [receivingLineId],
                                         total: 1 }, true);
    var newReceivingLine = this.createObject(receivingLineId,
                                             'receivingLine',
                                           { quantity: count || 5,
                                             lineItem: lineId,
                                             receiving: receivingId }, true);
    return Ember.run(function(){
      model.get('receivings').pushObject(newReceiving);

      if (lineItem)
        lineItem.get('receivingLines').pushObject(newReceivingLine);

      return newReceiving;
    });
  },


  createVendor: function(id, text){
    var purId = lookups.currentModel().get('id');

    return this.createObject(id, 'vendor', { purchase: purId,
                                             name: text || 'a vendor!' });
  },


  createNote: function(id, text){
    var purId = lookups.currentModel().get('id');

    return this.createObject(id, 'note', { purchase: purId,
                                           text: text || 'a note!' });
  },


  createTag: function(id, text){
    var purId = lookups.currentModel().get('id');

    return this.createObject(id, 'tag', { purchase: purId,
                                          text: text || 'a tag!!' });
  },


  createAttachment: function(id, skipPurchase){
    var purId = (!skipPurchase) ? lookups.currentModel().get('id') : null;

    return this.createObject(id, 'attachment', { purchase: purId }, skipPurchase);
  },


  createPurchase: function(id) {
    return this.createObject(id, 'purchase', { dateRequested: '1/1/2014' }, true);
  },


  createObject: function(id, type, attributes, skipAppend) {
    Ember.assert('No type was provided', !!type);
    Ember.assert('Type must be a string', Ember.typeOf(type) !== 'String');

    var store = lookups.store();

    return Ember.run(function(){
      id = id || getNextIdFrom(type);

      var newObject = store.push(type, Ember.merge({ id: id }, attributes || {}));

      if (!skipAppend)
        lookups.currentModel().get(type.pluralize()).pushObject(newObject);

      return newObject;
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
