var attr = DS.attr;

App.Tag = DS.Model.extend({
  name: attr(),
  isDestroy: attr(),

  purchase: DS.belongsTo('purchase'),
});
