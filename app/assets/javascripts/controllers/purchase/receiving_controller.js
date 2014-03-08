
App.ReceivingController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {

  needs: ['application'],
  applicationBinding: 'controllers.application',

  spinnerDom: function() {
    return $('.receiving_spinner');
  }.property(),


  isEditing: function() {
    return this.get('content').id === App.ReceivingGlobals.get('currentReceivingDoc.id');
  }.property('App.ReceivingGlobals.currentReceivingDoc'),


  actions: {

    // Start editing
    clickReceiving: function() {
      this.get('parentController').send('startEditRec', this.get('model'));
    },


    // Start hover
    startHover: function() {
      this.setHover(true);
    },


    // Stop hover
    stopHover: function() {
      this.setHover(false);
    }

  },


  setHover: function(hover) {
    var model = this.get('model');
    App.ReceivingGlobals.set('currentReceivingHoverDoc', ((hover === false) ? null : model));
  },


  saveRecordAfter: function(record, self, error) {
    if (!error) {
      self.get('parentController').stopReceiving();
    }
  },


  deleteRecordBefore: function(record, self) {
    this.get('parentController').stopReceiving();
    App.ReceivingGlobals.resetObject();
  },


  // Use our own enumerable so we can work backwards
  deleteRecordAfter: function(record, self, error) {
    var recLines = record.get('receivingLines'),
        store = self.store;

    if (store && recLines) {

      var length = recLines.get('length');
      for (var i = length - 1; i >= 0; i--) {

        var rec = recLines.nextObject(i);

        if (!isEmpty(rec)) {
          if (rec.get('isDirty'))
            rec.rollback();

          rec.send('unloadRecord');
        }
      }
    }
  }

});
