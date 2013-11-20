App.ReceivingController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, {
  needs: ['receiving_lines'],

  isEditing: function() {
    return this.get('content').id == this.get('purchase.currentReceivingDoc.id');
  }.property('purchase.currentReceivingDoc'),

  lineIds: function() {
    // reduce doesn't work here
    var res = [];
    this.get('receivingLines').forEach(function(line) {
      res.push({ id: line.id, count: line.get('quantity') });
    });
    return res;
  }.property('receivingLines.@each.id'),

  actions: {

    // Start editing
    clickReceiving: function() {
      this.get('parentController').confirmRollback();
      this.set('currentEditDoc', true);
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
    // Let this bubble up to our controller
    // http://madhatted.com/2013/5/26/communication-between-controllers-in-ember-js
    this.get('target').send('setLinesHover', this.get('lineIds'), hover);
  }

});
