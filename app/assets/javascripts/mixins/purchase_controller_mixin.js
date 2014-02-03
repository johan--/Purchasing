
App.PurchaseControllerMixin = Ember.Mixin.create({
  needs: ['application'],
  applicationBinding: 'controllers.application',

  isEditingTaxRate: false,
  isEditingAccounts: false,
  isEditing: false,

  metadata: function() {
    if (this.get('model.isLoaded'))
      return this.store.metadataFor('purchase');
  }.property('model.isLoaded'),


  spinnerDom: function() {
    return $('.main_spinner');
  }.property(),


  isOrdered: function() {
    return !isEmpty(this.get('datePurchased'));
  }.property('datePurchased'),


  isCancelled: function() {
    return !isEmpty(this.get('dateCancelled'));
  }.property('dateCancelled'),


  isReconciled: function() {
    return !isEmpty(this.get('dateReconciled'));
  }.property('dateReconciled'),


  isReceiving: function() {
    return !!App.ReceivingGlobals.get('currentReceivingDoc');
  }.property('App.ReceivingGlobals.currentReceivingDoc'),


  lineItemsClass: function() {
    if (this.get('isReceiving'))
      return 'col-lg-7 col-xs-12';
    else
      return 'col-lg-8 col-xs-12';
  }.property('isReceiving'),


  receivingsClass: function() {
    if (this.get('isReceiving'))
      return 'col-lg-5 col-xs-12';
    else
      return 'col-lg-4 col-xs-12';
  }.property('isReceiving'),


  canShowDeleteButton: function() {
    // You can delete a record up until it is purchased
    return isEmpty(this.get('datePurchased'));
  }.property('datePurchased'),


  canShowCancelButton: function() {
    // You can cancel a record after it has been assigned
    return !isEmpty(this.get('buyer'));
  }.property('buyer'),


  tabName: function() {
    var id = this.get('id'),
        datePurchased = this.get('datePurchased'),
        buyer = this.get('buyer'),
        dateReconciled = this.get('dateReconciled'),
        dateCancelled = this.get('dateCancelled'),
        starred = this.get('starred'),
        tabs = [];

    if (isEmpty(dateCancelled) && isEmpty(dateReconciled) && isEmpty(buyer))
      tabs.push('New');

    if (isEmpty(dateCancelled) && isEmpty(dateReconciled) && !isEmpty(buyer) && isEmpty(datePurchased))
      tabs.push('Pending');

    if (isEmpty(dateCancelled) && isEmpty(dateReconciled) && !isEmpty(buyer) && !isEmpty(datePurchased))
      tabs.push('Purchased');

    if (isEmpty(dateCancelled) && !isEmpty(dateReconciled))
      tabs.push('Reconciled');

    if (!isEmpty(dateCancelled))
      tabs.push('Cancelled');

    if (!isEmpty(starred))
      tabs.push('Starred');

    return tabs;
  }.property('id', 'datePurchased', 'buyer', 'dateReconciled', 'dateCancelled', 'starred'),


  actions: {

    openRecordEdit: function() {
      var record = this.get('model');
      this.transitionToRoute('purchase.edit', record );
      return false;
    },


    openRecordShow: function() {
      var record = this.get('model');
      this.transitionToRoute('purchase.show', record );
      return false;
    },


    claimPurchase: function() {
      var buyer = { name: App.current_user.get('first_name'), id: App.current_user.id };
      this.setBuyer(buyer);
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
      $('#attachmentsModal').modal('show');
    },


    emailRequisition: function() {
      $('#emailModal').modal('show');
      //TODO
      // if record.isDirty notify user first
    },


    printRequisition: function() {
      var self = this,
          model = self.get('model'),
          isDirty = self.get('recIsDirty'),
          url = App.Globals.namespace + '/purchases/' + model.id;

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
          url = App.Globals.namespace + '/purchases/' + model.id + '.pdf';

      if (isDirty) {
        if (!confirm("You have unsaved changes that will not be in the PDF. Click OK to continue.")) {
          return;
        }
      }

      window.open(url);
    },


    starMe: function() {
      var model = this.get('model'),
          star = this.get('starred');

      if (isEmpty(star))
        model.set('starred', moment().format(App.Globals.DATE_STRING_DATEBOX));
      else
        model.set('starred', null);
    },


    cancelEdit: function() {
      // Let model catch dirty / clean
      this.transitionToRoute('purchases.tabs');
    }
  },


  setBuyer: function(object) {
    var record = this.get('model');

    if (isEmpty(record.get('id'))) {
      record.set('buyer', object);
    } else {
      var id = (object) ? object.id : null;
      this._AJAX_buyer(id);
    }
  },


  _AJAX_buyer: function(id) {
    var self = this,
        record = this.get('model'),
        store = record.store,
        application = this.application;

    $('.main_spinner').show();

    $.ajax({
        type: 'POST',
        url: App.Globals.namespace + '/purchases/assign',
        data: { ids: [record.id], user_id: id }
      }).then(function(data){

      $('.main_spinner').hide();

      if (data && data.purchase)
        store.push('purchase', { id: record.get('id'), buyer: data.purchase.buyer }, true); // _partial == true so record is updated not replaced

      if (data && data.purchase && isEmpty(data.purchase.buyer))
        application.notify({message: 'Record un-assigned', type: 'notice'});
      else
        application.notify({message: 'Records assigned', type: 'notice'});

    }, function(error) {

      $('.main_spinner').hide();
      application.notify(error, 'error');

    });
  },


  toggleDate: function(field) {
    var cur_val = this.get(field),
        new_val = (isEmpty(cur_val)) ? moment().format(App.Globals.DATE_STRING) : null;

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


  saveRecordAfter: function(rec, self, error, data) {
    if (isEmpty(error)) {
      var record = this.get('model');
      this.transitionToRoute('purchase.show', record );
    }
  },


  deleteRecordBefore: function() {
  },


  deleteRecordAfter: function(record, self, error) {
    this.transitionToRoute('purchases.tabs');
  }
});
