App.PurchaseEditController = Ember.ObjectController.extend({
  needs:['application'],
  applicationBinding: 'controllers.application',

  currentReceivingDoc: null,

  vendorTokens: function() {
    tokens = [];
    this.get('vendors').forEach(function(vendor){
      tokens.push({ id: vendor.id, name: vendor.get('name')});
    });
    return tokens;
  }.property('vendors'),

  attachmentCount: function() {
    attachments = this.get('attachments');
    return (attachments) ? attachments.get('length') : 0;
  }.property('attachments'),

  grandTotal: function() {
    return this.get('lineItems').get('subTotal');
  }.property('lineItems.subTotal'), //, 'tax_rate', 'shipping', 'labor')

  actions: {
    setLinesHover: function(rec_ids, hover) {
      // We have to compare the array of ids from the line_item and receiving_doc
      // This would be easier if we could drill down instead of bubbling up
      parent = this;
      this.get('lineItems').forEach(function(line){
        line_ids = parent.getIdsForLine(line);
        rec_ids.forEach(function(item){
          line_ids.forEach(function(item2){
            if (item == item2)
              line.set('isHighlighted', hover);
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
