var attr = DS.attr;

App.LineItem = DS.Model.extend({
  sku: attr(),
  description: attr(),
  unit: attr(),
  quantity: attr(),
  price: attr(),
  isDestroy: attr(),
  received_count_server: attr(),  // This is the received count as sent from the server

  purchase: DS.belongsTo('purchase'),
  receivingLines: DS.hasMany('receivingLine'),

  extendedCost: function() {
    return toCurrency(this.get('extendedCostNumber'));
  }.property('extendedCostNumber'),

  extendedCostNumber: function() {
    var quantity = toNumber(this.get('quantity')) || 0,
        price = toNumber(this.get('price')) || 0;
    return quantity * price;
  }.property('quantity', 'price'),

  // Total # of items received (computed)
  receivedCount: function() {
    return this.get('receivingLines').reduce(function(res, line){
      return res + line.get('quantity');
    }, 0);
  }.property('receivingLines.@each.quantity'),

});
