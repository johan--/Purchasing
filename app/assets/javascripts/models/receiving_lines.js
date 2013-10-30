var attr = DS.attr;

App.ReceivingLine = DS.Model.extend({
  quantity: attr(),
  last_user: attr(),
  created_at: attr(),
  updated_at: attr(),
  destroy: attr(),

  receiving: DS.belongsTo('receiving'),
  lineItem: DS.belongsTo('lineItem')
});

App.ReceivingLineAdapter = DS.RESTAdapter.extend();
