App.ReceivingsController = Ember.ArrayController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application', 'purchaseEdit'],
  applicationBinding: 'controllers.application',
  purchaseBinding: 'controllers.purchaseEdit',

  itemController: 'receiving',

  spinnerDom: function() {
    return $('.receiving_spinner');
  }.property(),


  isAllReceived: function() {
    return this.get('purchase.received');
  }.property('purchase.received'),


  isNotAllReceived: function() {
    return !this.get('isAllReceived');
  }.property('isAllReceived'),


  isReceiving: function() {
    return !Ember.isEmpty(this.get('purchase.currentReceivingDoc'));
  }.property('purchase.currentReceivingDoc'),


  isDirty: function() {
    return this.get('purchase.currentReceivingDoc.isDirty');
  }.property('purchase.currentReceivingDoc.isDirty'),


  stopReceiving: function() {
    this.set('purchase.currentReceivingDoc', null);
    this.set('purchase.currentReceivingHoverDoc', null);
  },


  setHovering: function(model, val) {
    this.set('purchase.currentReceivingHoverDoc', (val === false) ? null : model);
  },


  actions: {
    cancelReceiving: function() {
      if (!this.confirmRollback())
        return;
      this.stopReceiving();
    },


    newReceiving: function() {
      var new_rec = this.store.createRecord('receiving');
      this.addObject(new_rec);
      this.set('purchase.currentReceivingDoc', new_rec);
    },


    receiveAll: function() {
      var record = this.get('content.firstObject.purchase'),
          store = record.get('store'),
          current = this.get('starred'),
          spinner = this.get('spinnerDom') || $();
          self = this;
      console.log(record);
      this.application.clearNotifications();
      $('.receive_all_button').addClass('button_down');
      spinner.show();

      $.post('/purchases/' + record.id + '/receive_all').then(function(data) {
        self.application.notify({message: 'Records received', type: 'notice'});
        spinner.hide();
       // store.push('purchase', data.purchase);
       // store.push('receiving', data.receivings);
        //store.push('receivingLine', data.receivingLine);
        record.reload();
      }, function(error) {
        $('.receive_all_button').removeClass('button_down');
        self.application.notifyWithJSON(error);

        spinner.hide();
      });
    },
  },


  confirmRollback: function() {
    var cur_doc = this.get('purchase.currentReceivingDoc');

    if (!Ember.isEmpty(cur_doc) && cur_doc.get('isDirty') === true){

      if (confirm('You are currently editing a record.  Okay to undo changes?')) {
        if (Ember.isEmpty(cur_doc.id))
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


  saveRecordAfter: function(record, self, error) {
    if (!error)
      self.stopReceiving();
  }

});
