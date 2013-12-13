App.PurchaseEditController = App.PurchaseController.extend({
  isEditingTaxRate: false,
  isEditingAccounts: false,

  metadata: function() {
    if (this.get('model.isLoaded'))
      return this.get('store').metadataFor('purchase');
  }.property('model.isLoaded'),


  spinnerDom: function() {
    return $('.purchase_spinner');
  }.property(),


  isOrdered: function() {
    return !Ember.isEmpty(this.get('datePurchased'));
  }.property('datePurchased'),


  isCancelled: function() {
    return!Ember.isEmpty(this.get('dateCancelled'));
  }.property('dateCancelled'),


  isReconciled: function() {
    return!Ember.isEmpty(this.get('dateReconciled'));
  }.property('dateReconciled'),


  vendorTokens: function() {
    return this.get('vendors').reduce(function(tokens, vendor){
      tokens.push({ id: vendor.id, name: vendor.get('name')});
      return tokens;
    }, []);
  }.property('vendors'),


  actions: {
    claimPurchase: function() {
      var model = this.get('model'),
          store = this.get('store'),
          user = this.get('metadata.currentUser');

      store.push('user', user);

      // Build relationship
      pushedNewRec = store.getById('user', user.id);
      model.set('buyer', pushedNewRec);
      model.save();
    },


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
        var line_ids = self.getIdsForLine(line);

        rec_ids.forEach(function(item){
          line_ids.forEach(function(item2){
            if (item.id == item2) {
              line.set('isHighlighted', hover);
              line.set('hoverReceivedCount', item.count);
            }
          });
        });
      });
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


    openAttachments: function() {
      $('.attachmentsContainer').show();
    },


    emailRequisition: function() {
      //TODO
      // if record.isDirty notify user first
    },


    printRequisition: function() {
      var self = this,
          model = self.get('model'),
          isDirty = self.get('recIsDirty'),
          url = '/purchases/' + model.id;

      if (isDirty) {
        if (!confirm("You have unsaved changes that will not be printed.  Click OK to continue.")) {
          return;
        }
      }

      window.open(url);
    },

    saveRequisition: function() {
      var self = this,
          model = self.get('model'),
          isDirty = self.get('recIsDirty'),
          url = '/purchases/' + model.id + '.pdf';

      if (isDirty) {
        if (!confirm("You have unsaved changes that will not be in the PDF. Click OK to continue.")) {
          return;
        }
      }

      window.open(url);
    }
  },


  toggleDate: function(field) {
    var cur_val = this.get(field),
        new_val = (Ember.isEmpty(cur_val)) ? moment().format(APP_DATE_STRING) : null;

    this.set(field, new_val);
  },


  // Build list of line id's for the receiving hover event
  getIdsForLine: function(line) {
    return line.get('receivingLines').reduce(function(res, line) {
      res.push(line.id);
      return res;
    }, []);
  }
});
