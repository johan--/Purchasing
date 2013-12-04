// Modified from https://github.com/Ember-SC/peepcode-ordr-test/wiki/Guide:-Testing-Setup-Helpers
var helperMethods = {
  container: function(){
    return App.__container__;
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

  metadata: function(app, model) {
    return helperMethods.store().metadataFor(model);
  },

  updateTestFixtures: function(app, model, setData) {
    var fixtures = Ember.A(model.FIXTURES),
        store = helperMethods.store();

    if (Ember.isEmpty(fixtures))
      return;

    Ember.run(function(){
      fixtures.forEach(function(item){
        store.find('purchase', item.id).then(function(record){

          Ember.merge(record, setData);
          // TODO:
          // we need to save the record, but record.save() is causing the app to crash
        });
      });
    });
  }
};

function exists(selector) {
  return !!find(selector).length;
}

(function(){

function mouseOver(app, selector, context) {
  var $el = findWithAssert(app, selector, context);
  Ember.run($el, 'mouseover');
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

Ember.Test.registerHelper('path', helperMethods.path);

Ember.Test.registerHelper('getMetadata', helperMethods.metadata);

Ember.Test.registerHelper('store', helperMethods.store);

Ember.Test.registerHelper('updateTestFixtures', helperMethods.updateTestFixtures);

Ember.Test.registerAsyncHelper('mouseOver', mouseOver);

App.injectTestHelpers();

})();
