App.ReceivingsController = Ember.ArrayController.extend({
  needs: ['application'],
  applicationBinding: 'controllers.application',

  itemController: 'receiving',

  spinnerDom: function() {
    return $('.receiving_spinner');
  }.property(),


  isAllReceived: function() {
    return this.get('parentController.received');
  }.property('parentController.received'),


  stopReceiving: function() {
    App.ReceivingGlobals.resetObject();
  },


  isReceiving: function() {
    return !!App.ReceivingGlobals.get('currentReceivingDoc');
  }.property('App.ReceivingGlobals.currentReceivingDoc'),


  isReceivingAndDirty: function() {
    return App.ReceivingGlobals.get('currentReceivingDoc.isDirty');
  }.property('App.ReceivingGlobals.currentReceivingDoc.isDirty'),


  actions: {

    startEditRec: function(record) {
      Ember.assert('Model was not sent for editing to startEditRec', !!record);

      if (this.checkForCanceled() || this.checkForDirty())
        return;
      App.ReceivingGlobals.set('currentReceivingDoc', record);
    },


    cancelReceiving: function() {
      if (!this.confirmRollbackForCancel())
        return;
      this.stopReceiving();
    },


    saveRecord: function() {
      var cur = App.ReceivingGlobals.get('currentReceivingDoc');

      if (isEmpty(cur))
        return;

      if (isEmpty(cur.id)) {
        this.get('lastObject').send('saveRecord');
        return;
      }

      this.forEach(function(item){
        if (item.get('id') === cur.id)
          item.send('saveRecord');
      });
    },


    newReceiving: function() {
      if (this.checkForCanceled() || this.checkForDirty())
        return;

      var new_rec = this.store.createRecord('receiving');
      this.addObject(new_rec);
      App.ReceivingGlobals.set('currentReceivingDoc', new_rec);
    },


    receiveAll: function() {
      var record = this.get('parentController.model'),
          store = this.store,
          current = this.get('starred'),
          spinner = this.get('spinnerDom') || $();
          self = this;

      if (this.checkForCanceled() || this.checkForDirty())
        return;

      $('.receive_all_button').addClass('button_down');
      spinner.show();

      Ember.$.ajax({
        type: 'POST',
        url: App.Globals.namespace + '/purchases/' + record.id + '/receive_all'
      }).then(function(data) {
        Ember.run(function() {

          self.application.notify({message: 'Records received', type: 'notice'});
          spinner.hide();

          var newRec = self.pushReceivingData(data, record);
          self.send('startEditRec', newRec);

        });
      }, function(error) {
        Ember.run(function() {

          $('.receive_all_button').removeClass('button_down');
          self.application.notify(error, 'error');

          spinner.hide();

        });
      });
    },
  },


  confirmRollbackForCancel: function() {
    var cur_doc = App.ReceivingGlobals.get('currentReceivingDoc');

    if (!isEmpty(cur_doc) && cur_doc.get('isDirty') === true){
      if (confirm('You are currently editing a record.  Okay to undo changes?')) {

        if (isEmpty(cur_doc.id))
          cur_doc.deleteRecord();
        else
          cur_doc.rollbackWithChildren();

        return true;
      } else {
        return false;
      }
    }

    return true;
  },


  checkForDirty: function() {
    if (this._checkItemsForDirty('receivings') ||
        this._checkItemsForDirty('lineItems'))
      return true;
  },


  checkForCanceled: function() {
    var record = this.get('parentController');

    if (record.get('dateCanceled')) {
      this.application.notify({ message: 'Cannot receive on a canceled requisition', type: 'error' });
      return true;
    }

    if (record.get('purchase_type') === 'Services') {
      this.application.notify({ message: 'Cannot receive on a Service requisition', type: 'error' });
      return true;
    }
  },


  _checkItemsForDirty: function(items) {
    Ember.assert('You must send a name of the items to check for dirty', !!items);

    var record = this.get('parentController'),
        records = record.get(items),
        docs = null;

    if (isEmpty(records))
      return;

    if (items == 'lineItems')
      docs = records.filterBy('isDirtyAndNotBlank', true);
    else
      docs = records.filterBy('isDirty', true);

    if (docs && docs.length > 0) {
      if (confirm('Warning: there are unsaved ' + items.underscore().replace('_', ' ') + ' that will be lost when you Receive All.  Proceed with loosing these changes?')) {
        docs.forEach(function(doc){
          doc.rollback();
        });
      } else {
        return true;
      }
    }
  },


  pushReceivingData: function(data, record) {
    Ember.assert('No data was sent from Receive All', !!data);
    Ember.assert('No receiving data was sent from Receive All', !!data.receiving);
    Ember.assert('No record was sent to push Receiving data to', !!record);

    // Push receiving and build relationship
    var store = record.store;
    store.pushPayload(data);

    var newRec = store.recordForId('receiving', data.receiving.id);

    Ember.assert('There was an error parsing the receiving document from the servers response', !!newRec);
    record.get('receivings').pushObject(newRec);

    // Push to line items
    var newLines = newRec.get('receivingLines');

    if (newLines) {
      record.get('lineItems').forEach(function(line){
        var id = line.get('id');

        if (id) {
          newLines.forEach(function(rec) {
            if (rec.get('lineItem.id') === id) {
              line.get('receivingLines').addObject(rec);
            }
          });
        }
      });
    }
    return newRec;
  }

});
