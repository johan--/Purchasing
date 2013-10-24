App.ReceivingController = Ember.ObjectController.extend({
  needs: 'receiving_lines',

  receivingDocDate: function() {
    return moment(this.get('created_at')).format('MMM D h:mm A');
  }.property('created_at'),

  lineIds: function() {
    // reduce doesn't work here
    res = [];
    this.get('receivingLines').forEach(function(line) {
      res.push(line.id);
    });
    return res;
  }.property('receivingLines.@each.id'),


  actions: {

    // Start editing
    clickReceiving: function(obj) {
      this.get('controllers.receiving_lines').test();
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

