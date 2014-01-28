
helperMethods = null;

(function(){

helperMethods = {
  container: function(){
    return App.__container__;
  },

  route: function(name){
    if (Ember.isEmpty(name))
      return helperMethods.currentRoute();
    else
      return helperMethods.container().lookup('route:' + name);
  },

  controller: function(name){
    return helperMethods.container().lookup('controller:' + name);
  },

  path: function(){
    return helperMethods.controller('application').get('currentPath');
  },

  store: function() {
    return helperMethods.controller('application').get('store');
  },

  currentRoute: function() {
    // http://jsfiddle.net/slindberg/EPGDp/3/
    var pathParts = helperMethods.path().split('.'),
        routeName = pathParts.slice(pathParts.length - 2).join('.');
    return helperMethods.container().lookup('route:' + routeName);
  },

  model: function() {
    return helperMethods.currentRoute().get('currentModel');
  },

  metadata: function(app, model) {
    return helperMethods.store().metadataFor(model);
  },

  queryParamsFor: function(app, model) {
    return helperMethods.container().lookup('route:' + model).get('queryParams');
  },

  updateTestFixtures: function(app, model, setData) {
    var fixtures = Ember.A(model.FIXTURES),
        store = helperMethods.store();

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
    var models = [App.Account,
                  App.Attachment,
                  App.LineItem,
                  App.Note,
                  App.PurchaseToTag,
                  App.Purchase,
                  App.ReceivingLine,
                  App.Receiving,
                  App.Tag,
                  App.User,
                  App.Vendor];

    // Use Deep copy so BASE remains intact
    $.each(models, function(index, model){
      model.FIXTURES = Ember.copy(model.FIXTURES_BASE, true);
    });
    META_FIXTURE = Ember.copy(META_FIXTURE_BASE, true);

    Ember.run(function(){
      App.current_user.set('roles', ['admin']);
    });
  },

  createLine: function(){
    var model = helperMethods.model(),
        store = model.get('store'),
        lineItems = model.get('lineItems');

    return Ember.run(function(){
      var id = getNextIdFrom('lineItem');
      return lineItems.pushObject(store.createRecord('lineItem', { id: id, description: 'a test line', quantity: 5 }));
    });
  },

  createReceiving: function(lineItem, count){
    if (Ember.isEmpty(lineItem)) {
      console.log('Cannot create a receiving document without a line item');
      return;
    }

    var model = helperMethods.model(),
        receivings = model.get('receivings'),
        store = lineItem.get('store');

    return Ember.run(function(){
      var receivingId = getNextIdFrom('receiving'),
          receivingLineId = getNextIdFrom('receivingLine');

      var resultReceiving = receivings.pushObject(store.createRecord('receiving'));
      var receivingLine = store.createRecord('receivingLine', { id: receivingLineId, quantity: (count || 5) });

      receivingLine.set('lineItem', lineItem);
      resultReceiving.get('receivingLines').pushObject(receivingLine);
      return resultReceiving;
    });
  }
};

function getNextIdFrom(model){
  var store = helperMethods.store(),
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

function mouseOver(app, selector, context) {
  var $el = findWithAssert(app, selector, context);
  Ember.run($el, 'mouseover');
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


function focusOut(app, selector, context) {
  var $el;
  $el = findWithAssert(app, selector, context);
  Ember.run(function() {
    $el.focusout().change();
  });
  return wait(app);
}

Ember.Test.registerHelper('path', helperMethods.path);

Ember.Test.registerHelper('getMetadataFor', helperMethods.metadata);

Ember.Test.registerHelper('store', helperMethods.store);

Ember.Test.registerHelper('model', helperMethods.model);

Ember.Test.registerHelper('getQueryParamsFor', helperMethods.queryParamsFor);

Ember.Test.registerHelper('updateTestFixtures', helperMethods.updateTestFixtures);

Ember.Test.registerAsyncHelper('mouseOver', mouseOver);

Ember.Test.registerAsyncHelper('change', change);

Ember.Test.registerAsyncHelper('focusOut', focusOut);

App.injectTestHelpers();

})();
