App.ReceivingsController = Ember.ArrayController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['application'],
  applicationBinding: 'controllers.application',

  itemController: 'receiving',

  spinnerDom: function() {
    return $('.receiving_spinner');
  }.property(),


  isAllReceived: function() {
    return this.get('parentController.received');
  }.property('parentController.received'),


  isNotAllReceived: function() {
    return !this.get('isAllReceived');
  }.property('isAllReceived'),


  isReceiving: function() {
    return !isEmpty(this.get('parentController.currentReceivingDoc'));
  }.property('parentController.currentReceivingDoc'),


  isDirty: function() {
    return this.get('parentController.currentReceivingDoc.isDirty');
  }.property('parentController.currentReceivingDoc.isDirty'),


  stopReceiving: function() {
    this.set('parentController.currentReceivingDoc', null);
    this.set('parentController.currentReceivingHoverDoc', null);
  },


  setHovering: function(model, val) {
    this.set('parentController.currentReceivingHoverDoc', (val === false) ? null : model);
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
      this.set('parentController.currentReceivingDoc', new_rec);
    },


    receiveAll: function() {
      var record = this.get('parentController.model'),
          store = this.get('store'),
          current = this.get('starred'),
          spinner = this.get('spinnerDom') || $();
          self = this;

      this.application.clearNotifications();
      $('.receive_all_button').addClass('button_down');
      spinner.show();

      $.post('/purchases/' + record.id + '/receive_all').then(function(data) {
        self.application.notify({message: 'Records received', type: 'notice'});
        spinner.hide();

        store.pushPayload('purchase', data);

      }, function(error) {
        $('.receive_all_button').removeClass('button_down');
        self.application.notify(error, 'error');

        spinner.hide();
      });
    },
  },


  confirmRollback: function() {
    var cur_doc = this.get('parentController.currentReceivingDoc');

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


  saveRecordAfter: function(record, self, error) {
    if (!error)
      self.stopReceiving();
  }

});
