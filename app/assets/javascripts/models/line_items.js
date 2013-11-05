var attr = DS.attr;

App.LineItem = DS.Model.extend({
  sku: attr(),
  description: attr(),
  unit: attr(),
  quantity: attr(),
  price: attr(),
  destroy: attr(),

  purchase: DS.belongsTo('purchase'),
  receivingLines: DS.hasMany('receivingLine')
});

App.LineItemAdapter = DS.RESTAdapter.extend();
