var attr = DS.attr;

App.ReceivingLine = DS.Model.extend({
  quantity: attr(),
  last_user: attr(),
  created_at: attr(),
  updated_at: attr(),
  isDestroy: attr(),

  receiving: DS.belongsTo('receiving'),
  lineItem: DS.belongsTo('lineItem'),

  lineItemTotal: function() {
    var lineCost = toNumber(this.get('lineItem.price')),
        quantity = this.get('quantity');

    return lineCost * quantity;
  }.property('lineItem.price', 'quantity')

});

App.ReceivingLineAdapter = DS.RESTAdapter.extend();
