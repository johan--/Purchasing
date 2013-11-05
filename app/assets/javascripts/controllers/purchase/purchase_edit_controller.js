App.PurchaseEditController = App.PurchaseController.extend({

  allReceived: function() {
    return this.get('received');
  }.property('received'),

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
    var attachments = this.get('attachments');
    return (attachments) ? attachments.get('length') : 0;
  }.property('attachments'),

  subTotal: function() {
    var total = 0,
        lineItems = this.get('lineItems');
    if (Ember.isEmpty(lineItems))
      return 0;

    lineItems.forEach(function(line){
      var quantity = toNumber(line.get('quantity') || 0),
          price = toNumber(line.get('price') || 0);
      total += quantity * price;
    });

    return total;
  }.property('lineItems.@each.quantity', 'lineItems.@each.price'),

  tax: function() {
    var rate = toNumber(this.get('tax_rate') || 0),
        subTotal = toNumber(this.get('subTotal') || 0);
    return rate * subTotal;
  }.property('subTotal', 'tax_rate'),

  grandTotal: function() {
    return (this.get('subTotal') || 0) +
           toNumber(this.get('tax') || 0) +
           toNumber(this.get('labor') || 0) +
           toNumber(this.get('shipping') || 0)
  }.property('subTotal', 'tax', 'shipping', 'labor'),

  testListener: function() {
    console.log('listener hit with:');
    console.log(this.get('currentReceivingDoc'));
    return this.get('currentReceivingDoc');
  }.property('currentReceivingDoc'),

  getIdsForLine: function(line) {
    var res = [];
    line.get('receivingLines').forEach(function(line) { res.push(line.id); });
    return res
  },

  actions: {
    setLinesHover: function(rec_ids, hover) {
      // We have to compare the array of ids from the line_item and receiving_doc
      // This would be easier if we could drill down instead of bubbling up
      var self = this;
      this.get('lineItems').forEach(function(line){
        line_ids = self.getIdsForLine(line);
        rec_ids.forEach(function(item){
          line_ids.forEach(function(item2){
            if (item.id == item2) {
              line.set('isHighlighted', hover);
              line.set('curRelatedRecDocCount', item.count);
            }
          })
        })
      })
    },

    // Number line items
    // If an ID is sent, those records are ignored (for when deleting a line)
    numberLines: function() {
      var num = 0;
      this.get('lineItems').forEach(function(line){
        if (line.get('_delete') != 1) {
          num += 1;
          line.set('lineNumber', num);
        }
      });
    },

    receiveAll: function() {
      var record = this.get('model'),
          current = this.get('starred'),
          self = this;

      this.application.clearNotifications();
      $('.receive_all_button').addClass('button_down');

      $.post('/purchases/' + record.id + '/receive_all').then(function() {
        self.application.notify({message: 'Records received', type: 'notice'});
        record.reload();

      }, function(error) {
        $('.receive_all_button').removeClass('button_down');
        self.application.notifyWithJSON(error);
      });
    },

    startReceivingEdit: function(doc) {
      this.get('model').set('currentReceivingDoc', doc);
      this.get('lineItems').set('isEditing', true);
    }
  }
});
