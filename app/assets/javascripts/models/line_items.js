
var attr = DS.attr;

App.LineItem = DS.Model.extend(App.MakeParentDirty, {

  parentObject: 'purchase',

  sku: attr(),
  description: attr(),
  unit: attr(),
  quantity: attr(),
  price: attr(),
  received_count_server: attr(),  // This is the received count as sent from the server, used for purchases.row

  isDestroy: attr(),

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
      if (!line.get('isDeleted')) {
        var quantity = line.get('quantity') || 0;
        return res + quantity;
      } else
        return res;
    }, 0);
  }.property('receivingLines.@each.quantity'),


  // Class for purchases hover line items
  purchaseHoverClass: function() {
    var quantity = this.get('quantity'),
        received = this.get('received_count_server');

    if (isEmpty(received) || isEmpty(quantity))
      return;

    if (received === quantity)
      return 'all-received';

    if (received > quantity || received < 0)
      return 'over-received';

    return 'partial-received';
  }.property('quantity', 'received_count_server'),


  isBlank: function() {
    var description = this.get('description'),
        unit = this.get('unit'),
        quantity = this.get('quantity'),
        price = this.get('price');

    return isEmpty(description) && isEmpty(quantity) && isEmpty(price) && isEmpty(unit);
  }.property('description', 'quantity', 'price'),


  isDirtyAndNotBlank: function() {
    return this.get('isDirty') && !this.get('isBlank');
  }.property('isDirty', 'isBlank')
});
