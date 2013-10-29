var attr = DS.attr;

App.Tag = DS.Model.extend({
  name: attr(),
  purchase: DS.belongsTo('purchase')
});

App.TagAdapter = DS.RESTAdapter.extend();
