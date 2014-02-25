
DS.RESTAdapter.reopen({
  namespace: 'api/1.0',

  pathForType: function(type) {
    var decamelized = Ember.String.decamelize(type);
    return Ember.String.pluralize(decamelized);
  }
});

App.getUrl = function(url) {
  return App.Globals.namespace + url;
};
