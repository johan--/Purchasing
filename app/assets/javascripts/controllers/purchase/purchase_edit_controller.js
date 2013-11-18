App.PurchaseEditController = App.PurchaseController.extend({
  isEditingTaxRate: false,
  isEditingAccounts: false,

  isOrdered: function() {
    return !Ember.isEmpty(this.get('datePurchased'));
  }.property('datePurchased'),

  isCancelled: function() {
    return!Ember.isEmpty(this.get('dateCancelled'));
  }.property('dateCancelled'),

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

  actions: {

    toggleOrdered: function() {
      this.toggleDate('datePurchased');
    },

    toggleCancelled: function() {
      this.toggleDate('dateCancelled');
    },

    startEditingTaxRate: function() {
      this.set('isEditingTaxRate', true);
    },

    stopEditingTaxRate: function() {
      this.set('isEditingTaxRate', false);
    },

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
              line.set('hoverReceivedCount', item.count);
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

    openAttachments: function() {
      $('.attachmentsContainer').show();
    },

    emailRequisition: function() {
      //TODO
    },

    printRequisition: function() {
      //TODO
    }
  },

  toggleDate: function(field) {
    var cur_val = this.get(field),
        new_val = (Ember.isEmpty(cur_val)) ? moment().format('MMM D, YY') : null;

    this.set(field, new_val);
  },

  // Build list of line id's for the receiving hover event
  getIdsForLine: function(line) {
    var res = [];
    line.get('receivingLines').forEach(function(line) { res.push(line.id); });
    return res
  }

});
