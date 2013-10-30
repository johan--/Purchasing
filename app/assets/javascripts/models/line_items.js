var attr = DS.attr;

App.LineItem = DS.Model.extend({
  sku: attr(),
  description: attr(),
  unit: attr(),
  quantity: attr(),
  price: attr(),
  purchases: DS.belongsTo('purchase'),
  receivingLines: DS.hasMany('receivingLine'),
  destroy: attr()
});

App.LineItemAdapter = DS.RESTAdapter.extend();
