
DS.RESTAdapter.reopen({
  namespace: 'api/1.0',

  pathForType: function(type) {
    var decamelized = Ember.String.decamelize(type);
    return Ember.String.pluralize(decamelized);
  }
});

