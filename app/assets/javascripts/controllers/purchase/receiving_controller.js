App.ReceivingController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['receiving_lines', 'application'],
  applicationBinding: 'controllers.application',

  spinnerDom: function() {
    return $('.receiving_spinner');
  }.property(),


  isEditing: function() {
    return this.get('content').id == this.get('purchase.currentReceivingDoc.id');
  }.property('purchase.currentReceivingDoc'),


  lineIds: function() {
    return this.get('receivingLines').reduce(function(res, line){
      res.push({ id: line.id, count: line.get('quantity') });
      return res;
    }, []);
  }.property('receivingLines.@each.id'),


  actions: {
    // Start editing
    clickReceiving: function() {
      this.get('parentController').confirmRollback();
      this.set('purchase.currentReceivingDoc', this.get('model'));
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
    this.get('parentController').setHovering(this.get('model'), hover);
  },


  deleteRecordBefore: function(record, self) {
    this.get('parentController').stopReceiving();
  },


  deleteRecordAfter: function(record, self, error) {
    // Don't bother with trying to clean up relationships, just reload all data
    this.get('parentController.purchase.model').reload();
  }

});
