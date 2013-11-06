
App.ReceivingArrowView = Ember.View.extend({

  tagName: 'i',
  classNames: ['fa'],
  classNameBindings: ['myClassName'],

  pressTimer: null,  // Timer until we check
  pressStart: null,  // When button was pressed

  direction: 1,


  myClassName: function() {
    if (this.get('direction') == -1)
      return 'fa-minus receiving_left';
    else
      return 'fa-plus receiving_right';
  }.property('direction'),

  mouseDown: function(e) {
    var self = this;

    this.pressStart = new Date();
    this.pressTimer = setInterval(function(){ self.incrementPlus(); }, 400);
  },

  mouseUp: function(e) {
    var current_time = new Date();
    clearInterval(this.pressTimer);

    if (current_time - this.get('pressStart') < 500) {
      this.setAmount(this.get('direction'));
    }
    this.pressStart = null;
  },

  incrementPlus: function() {
    this.setAmount(this.get('direction') * 10);
  },

  setAmount: function(amount) {
    this.get('controller').send('receivingIncrement', amount);
  }

})
