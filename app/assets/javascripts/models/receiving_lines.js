var attr = DS.attr;

App.ReceivingLine = DS.Model.extend({
  total: attr(),
  last_user: attr(),
  quantity: attr(),
  created_at: attr(),
  updated_at: attr(),

  purchases: DS.belongsTo('receiving')
});

App.ReceivingLineAdapter = DS.RESTAdapter.extend();
