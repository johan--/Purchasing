
App.PurchaseControllerMixin = Ember.Mixin.create({
  needs: ['application'],
  applicationBinding: 'controllers.application',

  isEditingTaxRate: false,
  isEditingAccounts: false,
  isEditing: false,

  currentReceivingDoc: null,
  currentReceivingHoverDoc: null,

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
    var vendors = this.get('vendors');

    if (vendors)
      return vendors.reduce(function(tokens, vendor){
        tokens.push({ id: vendor.id, name: vendor.get('name')});
        return tokens;
      }, []);
  }.property('vendors'),


  vendorsList: function() {
    var vendors = this.get('vendors');

    if (vendors) {
      return vendors.reduce(function(res, vendor){
        res.push(vendor.get('name'));
        return res;
      }, []).join(', ');;
    }

  }.property('vendors'),


  vendorCount: function() {
    return this.get('vendors.length');
  }.property('vendors.length'),


  actions: {
    reloadMe: function() {
      this.get('model').reload();
    },


    openRecordEdit: function() {
      this.application.clearNotifications();
      var record = this.get('model');
      this.transitionToRoute('purchase.edit', record );
      return false;
    },


    openRecordShow: function() {
      this.application.clearNotifications();
      var record = this.get('model');
      this.transitionToRoute('purchase.show', record );
      return false;
    },


    claimPurchase: function() {
      this.setBuyer(this.get('metadata.currentUser.id'));
    },


    unclaimPurchase: function() {
      this.setBuyer(null);
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
    },


    starMe: function() {
      var self = this,
          record = this.get('model'),
          store = record.get('store'),
          application = self.application;

      this.application.clearNotifications();
      $('.main_spinner').show();

      $.post('/purchases/' + record.id + '/toggle_starred').then(function(data) {

        application.notify({ message: 'Star updated', type: 'notice' });
        $('.main_spinner').hide();

        if (data && data.purchase)
          store.push('purchase', data.purchase);

      }, function(error) {
        $('.main_spinner').hide();
        application.notify({ message: 'Failed to update Star: ' + error.responseText, type: 'error' });
      });

      $('.ui-tooltip').remove();
      return false;
    },


    cancelEdit: function() {
      this.application.clearNotifications();
      // Let model catch dirty / clean
      window.history.back();
    }
  },


  setBuyer: function(id) {
    var self = this,
        record = this.get('model'),
        store = record.get('store'),
        application = this.application;

    $('.main_spinner').show();

    $.post('/purchases/assign', { ids: [record.id], user_id: id }).then(function(data){
      application.notify({message: 'Records assigned', type: 'notice'});
      $('.main_spinner').hide();

      if (data && data.purchase)
        store.push('purchase', data.purchase);

    }, function(error) {
      $('.main_spinner').hide();
      application.notifyWithJSON(error.responseText);
    });
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
  },


  saveRecordBefore: function() {
  },


  saveRecordAfter: function(rec, self, error) {
    var record = this.get('model');
    this.transitionToRoute('purchase.show', record );
  },


  deleteRecordBefore: function() {
  },


  deleteRecordAfter: function(record, self, error) {
  }
});
