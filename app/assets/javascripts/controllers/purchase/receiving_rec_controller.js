App.ReceivingRecController = Ember.ObjectController.extend({
  needs: 'receiving_lines',

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
    clickReceiving: function(obj) {
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

// TODO: Make sure when creating a new RecLineItem you store the LineItem id in line_item_id
