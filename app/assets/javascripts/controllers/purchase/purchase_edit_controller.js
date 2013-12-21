App.PurchaseEditController = App.PurchaseController.extend({
  isEditingTaxRate: false,
  isEditingAccounts: false,
  isEditing: false,

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
    return !Ember.isEmpty(this.get('dateCancelled'));
  }.property('dateCancelled'),


  isReconciled: function() {
    return !Ember.isEmpty(this.get('dateReconciled'));
  }.property('dateReconciled'),


  isReceiving: function() {
    return !Ember.isEmpty(this.get('currentReceivingDoc'));
  }.property('currentReceivingDoc'),


  vendorTokens: function() {
    return this.get('vendors').reduce(function(tokens, vendor){
      tokens.push({ id: vendor.id, name: vendor.get('name')});
      return tokens;
    }, []);
  }.property('vendors'),


  vendorsList: function() {
    var vendors = this.get('vendors').reduce(function(res, vendor){
      res.push(vendor.get('name'));
      return res;
    }, []);

    return vendors.join(', ');
  }.property('vendors'),


  vendorCount: function() {
    return this.get('vendors.length');
  }.property('vendors.length'),


  actions: {
    reloadMe: function() {
      this.get('model').reload();
    },


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


    unclaimPurchase: function() {
      var model = this.get('model');

      model.set('buyer', null);
      model.save();
    },


    toggleOrdered: function() {
      this.toggleDate('datePurchased');
    },


    toggleCancelled: function() {
      this.toggleDate('dateCancelled');
    },


    toggleEditing: function() {
      var val = this.get('isEditing');
      this.set('isEditing', !val);
    },


    startEditingTaxRate: function() {
      this.set('isEditingTaxRate', true);
    },


    stopEditingTaxRate: function() {
      this.set('isEditingTaxRate', false);
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
