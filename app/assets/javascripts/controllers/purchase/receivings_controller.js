App.ReceivingsController = Ember.ArrayController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: 'application',
  applicationBinding: 'controllers.application',
  itemController: 'receiving',


  spinnerDom: function() {
    return $('.receiving_spinner');
  }.property(),


  allReceived: function() {
    return this.get('purchase.received');
  }.property('purchase.received'),


  isReceiving: function() {
    return !Ember.isEmpty(this.get('currentReceivingDoc'))
  }.property('currentReceivingDoc'),


  isDirty: function() {
    return this.get('currentReceivingDoc.isDirty');
  }.property('currentReceivingDoc.isDirty'),


  stopReceiving: function() {
    this.set('content.firstObject.purchase.currentReceivingDoc', null);
    this.get('content').filterBy('currentEditDoc').forEach(function(row){
      row.set('currentEditDoc', false);
    });
  },


  currentReceivingDoc: function() {
    return this.get('content.firstObject.purchase.currentReceivingDoc');
  }.property('content.firstObject.purchase.currentReceivingDoc'),


  actions: {
    cancelReceiving: function() {
      if (!this.confirmRollback())
        return;
      this.stopReceiving();
    },


    newReceiving: function() {
      var new_rec = this.store.createRecord('receiving');
      new_rec.set('currentEditDoc', true);

      this.addObject(new_rec);

      var purchase = this.get('content.firstObject.purchase')
      purchase.set('currentReceivingDoc', new_rec);
    },


    receiveAll: function() {
      var record = this.get('content.firstObject.purchase'),
          current = this.get('starred'),
          spinner = this.get('spinnerDom') || $();
          self = this;

      this.application.clearNotifications();
      $('.receive_all_button').addClass('button_down');
      spinner.show();

      $.post('/purchases/' + record.id + '/receive_all').then(function() {
        self.application.notify({message: 'Records received', type: 'notice'});
        record.reload();
        spinner.hide();

      }, function(error) {
        $('.receive_all_button').removeClass('button_down');
        self.application.notifyWithJSON(error);

        spinner.hide();
      });
    },
  },


  confirmRollback: function() {
    var cur_doc = this.get('currentReceivingDoc');

    if (!Ember.isEmpty(cur_doc) && cur_doc.get('isDirty') == true){

      if (confirm('You are currently editing a record.  Okay to undo changes?')) {
        if (Ember.isEmpty(cur_doc.id))
          cur_doc.deleteRecord();
        else
          cur_doc.rollbackWithChildren();

        return true
      } else {
        return false;
      }
    }

    return true
  },


  saveRecordAfter: function(record, self) {
    self.stopReceiving();
  }

});
