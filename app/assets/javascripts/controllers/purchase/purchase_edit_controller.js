App.PurchaseEditController = App.PurchaseController.extend({
  currentReceivingDoc: null,

  vendorTokens: function() {
    var tokens = [],
        vendors = this.get('vendors');

    if (Ember.isEmpty(vendors))
      return null;

    vendors.forEach(function(vendor){
      tokens.push({ id: vendor.id, name: vendor.get('name')});
    });
    return tokens;
  }.property('vendors'),

  attachmentCount: function() {
    attachments = this.get('attachments');
    return (attachments) ? attachments.get('length') : 0;
  }.property('attachments'),

  subTotal: function() {
    var total = 0,
        lineItems = this.get('lineItems');
    if (Ember.isEmpty(lineItems))
      return 0;

    lineItems.forEach(function(line){
      quantity = toNumber(line.get('quantity'));
      price = toNumber(line.get('price'));
      total += quantity * price;
    });

    return total;
  }.property('lineItems.quantity', 'lineItems.price'),

  tax: function() {
    var rate = toNumber(this.get('tax_rate')),
        subTotal = toNumber(this.get('subTotal'));
    return rate * subTotal;
  }.property('subTotal', 'tax_rate'),

  grandTotal: function() {
    return this.get('subTotal') +
           toNumber(this.get('tax')) +
           toNumber(this.get('labor')) +
           toNumber(this.get('shipping'))
  }.property('subTotal', 'tax', 'shipping', 'labor'),

  actions: {
    setLinesHover: function(rec_ids, hover) {
      // We have to compare the array of ids from the line_item and receiving_doc
      // This would be easier if we could drill down instead of bubbling up
      parent = this;
      this.get('lineItems').forEach(function(line){
        line_ids = parent.getIdsForLine(line);
        rec_ids.forEach(function(item){
          line_ids.forEach(function(item2){
            if (item.id == item2) {
              line.set('isHighlighted', hover);
              line.set('curRelatedRecDocCount', item.count);
            }
          })
        })
      })
    }
  },

  getIdsForLine: function(line) {
    res = [];
    line.get('receivingLines').forEach(function(line) { res.push(line.id); });
    return res
  }
});
