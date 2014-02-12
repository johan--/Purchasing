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
      Ember.assert('Model was not sent for editing', !!record);

      if (this.checkForCancelled() || this.checkForDirty())
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
      if (this.checkForCancelled() || this.checkForDirty())
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

      if (this.checkForCancelled() || this.checkForDirty())
        return;

      $('.receive_all_button').addClass('button_down');
      spinner.show();

      $.ajax({
        type: 'POST',
        url: App.Globals.namespace + '/purchases/' + record.id + '/receive_all'
      }).then(function(data) {
        Ember.run(function() {

          self.application.notify({message: 'Records received', type: 'notice'});
          spinner.hide();

          self.pushReceivingData(data, record);

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


  checkForCancelled: function() {
    if (this.get('dateCancelled')) {
      application.notify({ message: 'Cannot receive on a cancelled requisition', type: 'error' });
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
      docs = records.filter(function(line){
        if (line.get('isDirty') && (!isEmpty(line.get('description')) || !isEmpty(line.get('unit')) ||
            !isEmpty(line.get('quantity')) || !isEmpty(line.get('price'))))
          return true;
      });
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
    Ember.assert('No record was sent to push Receiving data to', !!record);

    var store = record.store,
        newRec = null;

    // Push receiving record
    if (data && data.receiving) {
      newRec = store.push('receiving', data.receiving);
      record.get('receivings').pushObject(newRec);
    }

    // Push receivingLines
    if (data && newRec && data.receiving_lines) {
      // Push to receiving rec
      newLines = store.pushMany('receivingLine', data.receiving_lines);
      newRec.get('receivingLines').addObjects(newLines);

      // Push to line items
      record.get('lineItems').forEach(function(line){
        var id = parseInt(line.get('id'), 10);

        if (id) {
          newLines.forEach(function(rec) {
            if (rec._data.line_item_id === id) {
              line.get('receivingLines').addObject(rec);
            }
          });
        }
      });
    }
  }

});
