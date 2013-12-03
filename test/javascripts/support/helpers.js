
// Modified from https://github.com/Ember-SC/peepcode-ordr-test/wiki/Guide:-Testing-Setup-Helpers
var helperMethods = {
  container: function(){
    return App.__container__;
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
  metadata: function(model) {
    return this.store().metadataFor(model);
  }
};

Ember.Test.registerHelper('path', function() {
  return helperMethods.path();
});

Ember.Test.registerHelper('store', function() {
  return helperMethods.store();
});

App.injectTestHelpers();

function exists(selector) {
  return !!find(selector).length;
}
