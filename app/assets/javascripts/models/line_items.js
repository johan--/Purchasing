var attr = DS.attr;

App.LineItem = DS.Model.extend({
  sku: attr(),
  description: attr(),
  unit: attr(),
  quantity: attr(),
  price: attr(),
  destroy: attr(),

  purchase: DS.belongsTo('purchase'),
  receivingLines: DS.hasMany('receivingLine'),

  extendedCost: function() {
    var quantity = toNumber(this.get('quantity')) || 0,
        price = toNumber(this.get('price')) || 0;
    return toCurrency(quantity * price);
  }.property('quantity', 'price'),

  // Total # of items received
  receivedCount: function() {
    var lines = this.get('receivingLines'),
        res = 0;

    lines.forEach(function(cur){
      res += cur.get('quantity');
    });
    return res;
  }.property('receivingLines.@each.quantity'),

});

App.LineItemAdapter = DS.RESTAdapter.extend();
