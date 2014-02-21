
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


  isCanceled: function() {
    return !isEmpty(this.get('dateCanceled'));
  }.property('dateCanceled'),


  isReconciled: function() {
    return !isEmpty(this.get('dateReconciled'));
  }.property('dateReconciled'),


  isReceiving: function() {
    return !!App.ReceivingGlobals.get('currentReceivingDoc');
  }.property('App.ReceivingGlobals.currentReceivingDoc'),


  canReceive: function() {
    var canceled = this.get('dateCanceled'),
        type = this.get('purchase_type'),
        id = this.get('id');

    if (!isEmpty(id) && isEmpty(canceled) && type !== 'services')
      return true;
  }.property('dateCanceled', 'purchase_type'),


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


  canDelete: function() {
    // You can delete a record up until it is purchased
    return isEmpty(this.get('datePurchased'));
  }.property('datePurchased'),


  actions: {

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
          url = App.getUrl('/purchases/' + model.id);

      window.open(url);
    },


    saveRequisition: function() {
      if (this._notifyIfIsDirty('You have unsaved changes that will not be in the PDF. Click OK to continue.'))
        return;

      var model = this.get('model'),
          url = App.getUrl('/purchases/' + model.id + '.pdf');

      window.open(url);
    },


    starMe: function() {
      var model = this.get('model'),
          star = this.get('starred');

      if (isEmpty(star))
        model.set('starred', moment().format(App.Globals.DATE_STRING));
      else
        model.set('starred', null);
    },


    cancelEdit: function() {
      // Let model catch dirty / clean
      window.history.back();
    },


    cancelRequisition: function() {
      this._cancelRecordAjax();
    },


    toggleOrderType: function() {
      var currentType = this.get('purchase_type');

      var newType = (currentType==='materials') ? 'services' : 'materials';
      this.set('purchase_type', newType);
    },


    sendEmail: function(url, formData) {
      var self = this,
          application = this.application;

      application.clearNotifications();

      $.ajax({
        type: 'post',
        url: url,
        data: formData
      }).then(function(payload) {

        application.notify({ message: 'Email successfully sent', type: 'notice' });

        if (payload && payload.note) {
          var newObj = self.store.push('note', payload.note);

          if (newObj)
            self.get('notes').pushObject(newObj);
        }

      }, function(error) {

        application.notify(error);

      });
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

    application.clearNotifications();
    $('.main_spinner').show();

    $.ajax({
      type: 'POST',
      url: App.getUrl('/purchases/assign'),
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


  _cancelRecordAjax: function() {
    var self = this,
        application = this.application,
        spinner = this.get('spinnerDom') || $(),
        isInitiallyNotCanceled = isEmpty(this.get('dateCanceled'));

    if (isInitiallyNotCanceled)
      if (!confirm('This will cancel this requisition.  Okay to cancel?'))
        return;

    application.clearNotifications();
    var record = this.get('model');

    var newCancel = (record.get('dateCanceled')) ? null : moment().format(App.Globals.DATE_STRING);
    spinner.show();

    $.ajax({
      type: 'PUT',
      url: App.getUrl('/purchases/' + record.id),
      data: { purchase: { date_canceled: newCancel } }
    }).then(function(response){

      console.log(response)
      self.store.pushPayload(response);
      var message = (isInitiallyNotCanceled) ? 'Record canceled' : 'Record un-canceled';
      application.notify({message: message, type: 'notice'});

      spinner.hide();

      if (application.currentRouteName === 'purchase.edit')
        self.transitionToRoute('purchase.show', record.id);

    }, function(error){

      record.rollback();
      application.notify(error, 'error');

      console.log(error);
      spinner.hide();

    });
  }
});
