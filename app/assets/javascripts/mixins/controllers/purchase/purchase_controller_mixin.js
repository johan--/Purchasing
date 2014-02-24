
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


  hasId: Ember.computed.bool('id'),

  isOrdered: Ember.computed.bool('datePurchased'),
  isCanceled: Ember.computed.bool('dateCanceled'),
  isNotCanceled: Ember.computed.not('isCanceled'),
  isReconciled: Ember.computed.bool('dateReconciled'),

  isMaterial: Ember.computed.equal('purchase_type', 'materials'),
  canCancel: Ember.computed.bool('datePurchased'),
  canReceive: Ember.computed.and('isNotCanceled', 'isMaterial', 'hasId'),

  isReceiving: function() {
    return !!App.ReceivingGlobals.get('currentReceivingDoc');
  }.property('App.ReceivingGlobals.currentReceivingDoc'),


  lineItemsClass: function() {
    return (this.get('isReceiving')) ? 'col-lg-7 col-xs-12' : 'col-lg-8 col-xs-12';
  }.property('isReceiving'),


  receivingsClass: function() {
    return (this.get('isReceiving')) ? 'col-lg-5 col-xs-12' : 'col-lg-4 col-xs-12';
  }.property('isReceiving'),


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
      var star = this.get('starred'),
          newStar = (isEmpty(star)) ? moment().format(App.Globals.DATE_STRING) : null;
      this.get('model').set('starred', newStar);
    },


    cancelEdit: function() {
      window.history.back();  // Let model catch dirty / clean
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
    },


    newAccountSave: function(number) {
      var self = this,
          store = this.store,
          application = this.application,
          spinner = this.get('spinnerDom'),
          user_id = this.get('requester.id');

      if (isEmpty(user_id)) {
        application.notify({ message: 'Cannot create an account when requester is not set', type: 'error' });
        return;
      }

      spinner.show();
      var payload = { account: { number: number, user_id: user_id } };

      $.ajax({
        type: 'POST',
        url: App.getUrl('/accounts'),
        data: payload
      }).then(function(newObject){
        Ember.run(function() {

          if (newObject) {
            store.push('account', newObject.account);

            // Build relationship
            var newAccount = store.getById('account', newObject.account.id);
            self.setAccount(newAccount);
          } else {
            application.notify('The server did not respond with the new account');
          }

          spinner.hide();

        });
      }, function(error) {
        Ember.run(function() {

          application.notify(error);
          spinner.hide();

        });
      });
    }
  },


  setAccount: function(acct) {
    var model = this.get('model');
    model.set('account', acct);
    model.send('becomeDirty');
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
          application.notify({ message: 'Record un-assigned', type: 'notice' });
        else
          application.notify({ message: 'Records assigned', type: 'notice' });

      });
    }, function(error) {
      Ember.run(function() {

        $('.main_spinner').hide();
        application.notify(error);

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
    var isDirty = this.get('model.isDirty');

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

      self.store.pushPayload(response);
      var message = (isInitiallyNotCanceled) ? 'Record canceled' : 'Record un-canceled';
      application.notify({ message: message, type: 'notice' });

      spinner.hide();

      if (application.currentRouteName === 'purchase.edit')
        self.transitionToRoute('purchase.show', record.id);

    }, function(error){

      record.rollback();
      application.notify(error);

      console.log(error);
      spinner.hide();

    });
  }
});
