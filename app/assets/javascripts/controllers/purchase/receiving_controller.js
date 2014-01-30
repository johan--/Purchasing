App.ReceivingController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['receiving_lines', 'application'],
  applicationBinding: 'controllers.application',

  spinnerDom: function() {
    return $('.receiving_spinner');
  }.property(),


  isEditing: function() {
    return this.get('content').id == this.get('parentController.currentReceivingDoc.id');
  }.property('parentController.currentReceivingDoc'),


  lineIds: function() {
    return this.get('receivingLines').reduce(function(res, line){
      res.push({ id: line.id, count: line.get('quantity') });
      return res;
    }, []);
  }.property('receivingLines.@each.id'),


  actions: {

    // Start editing
    clickReceiving: function() {
      this.get('target').confirmRollback();
      this.set('parentController.currentReceivingDoc', this.get('model'));
    },


    // Start hover
    startHover: function(obj) {
      this.setHover(true);
    },


    // Stop hover
    stopHover: function(obj) {
      this.setHover(false);
    }
  },


  setHover: function(hover) {
    this.get('target').setHovering(this.get('model'), hover);
  },


  deleteRecordBefore: function(record, self) {
    this.get('target').stopReceiving();
  },


  // Use our own enumerable so we can work backwards
  deleteRecordAfter: function(record, self, error) {
    var recLines = record.get('receivingLines'),
        store = self.get('store');

    if (store && recLines) {

      var length = recLines.get('length');
      for (i = length - 1; i >= 0; i--) {

        rec = recLines.nextObject(i);

        if (!isEmpty(rec)) {
          if (rec.get('isDirty')) {
            console.log(rec);
            rec.rollback();
          }
          else
            store.unloadRecord(rec);
        }
      }
    }
  }

});
