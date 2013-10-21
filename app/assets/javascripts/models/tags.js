var attr = DS.attr;

App.Tag = DS.Model.extend({
  name: attr(),
  purchases: DS.hasMany('purchase')
});

App.TagAdapter = DS.RESTAdapter.extend();
