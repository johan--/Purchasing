
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


  canReceive: function() {
    var cancelled = this.get('dateCancelled'),
        type = this.get('purchase_type'),
        id = this.get('id');

    if (!isEmpty(id) && isEmpty(cancelled) && type !== 'services')
      return true;
  }.property('dateCancelled', 'purchase_type'),


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
     if (this._notifyIfIsDirty('You have unsaved changes that will not be emailed.  Click OK to continue.'))
        return;

      $('#emailModal').modal('show');
    },


    printRequisition: function() {
      if (this._notifyIfIsDirty('You have unsaved changes that will not be printed.  Click OK to continue.'))
        return;

      var model = this.get('model'),
          url = App.Globals.namespace + '/purchases/' + model.id;

      window.open(url);
    },


    saveRequisition: function() {
      if (this._notifyIfIsDirty('You have unsaved changes that will not be in the PDF. Click OK to continue.'))
        return;

      var model = this.get('model'),
          url = App.Globals.namespace + '/purchases/' + model.id + '.pdf';

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
    },


    cancelRequisition: function() {
      this._cancelAjax();
    },


    toggleOrderType: function() {
      var currentType = this.get('purchase_type');

      var newType = (currentType==='materials') ? 'services' : 'materials';
      this.set('purchase_type', newType);
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
      Ember.run(function() {

        $('.main_spinner').hide();

        if (data && data.purchase)
          store.push('purchase', { id: record.get('id'), buyer: data.purchase.buyer }, true); // _partial == true so record is updated not replaced

        if (data && data.purchase && isEmpty(data.purchase.buyer))
          application.notify({message: 'Record un-assigned', type: 'notice'});
        else
          application.notify({message: 'Records assigned', type: 'notice'});

      });
    }, function(error) {
      Ember.run(function() {

        $('.main_spinner').hide();
        application.notify(error, 'error');

      });
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


  saveRecordAfter: function(rec, self, error) {
    if (isEmpty(error)) {
      var record = this.get('model');
      this.transitionToRoute('purchase.show', record );
    }
  },


  deleteRecordBefore: function() {
  },


  deleteRecordAfter: function(record, self, error) {
    this.transitionToRoute('purchases.tabs');
  },


  _notifyIfIsDirty: function(message) {
    Ember.assert('You must pass a message to notify with', !!message);
    var model = this.get('model'),
        isDirty = model.get('isDirty');

    if (isDirty)
      if (!confirm(message))
        return true;
  },


  _cancelAjax: function() {
    var self = this,
        application = this.application,
        spinner = this.get('spinnerDom') || $(),
        isInitiallyNotCancelled = isEmpty(this.get('dateCancelled'));

    if (isInitiallyNotCancelled)
      if (!confirm('This will cancel this requisition.  Okay to cancel?'))
        return;

    var record = this.get('model');

    spinner.show();

    $.ajax({
      type: 'POST',
      url: App.Globals.namespace + '/purchases/' + record.id + '/cancel'
    }).then(function(response){

      self.store.pushPayload(response);
      var message = (isInitiallyNotCancelled) ? 'Record canceled' : 'Record un-canceled';
      application.notify({message: message, type: 'notice'});

      spinner.hide();

      if (isInitiallyNotCancelled)
        self.transitionToRoute('purchase.show', record.id);

    }, function(error){

      record.rollback();
      application.notify(error, 'error');

      console.log(error);
      spinner.hide();

    });
  }
});