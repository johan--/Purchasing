
App.ReceivingArrowView = Ember.View.extend({
  tagName: 'i',
  classNames: ['fa'],
  classNameBindings: ['myClassName'],

  pressTimer: null,  // Timer until we check
  pressStart: null,  // When button was pressed

  direction: 1,


  myClassName: function() {
    if (this.get('direction') === -1)
      return 'fa-minus receiving_left';
    else
      return 'fa-plus receiving_right';
  }.property('direction'),


  mouseDown: function(e) {
    var self = this;
    this.stopTimer();

    this.pressStart = new Date();
    // Ember run doesn't have an equivalent for setInterval
    this.pressTimer = setInterval(function() { self.incrementStep(); }, 400);
  },


  mouseUp: function(e) {
    var current_time = new Date();
    this.stopTimer();

    if (current_time - this.get('pressStart') < 500) {
      this.setAmount(this.get('direction'));
    }
    this.pressStart = null;
  },


  incrementStep: function() {
    // This will not go below 0 and not above total quantity
    var direction = this.get('direction'),
        incrementAmount = 10,
        quantity = this.get('controller.quantity'),
        receivedCount = this.get('controller.receivedCount'),
        finalAmount = direction * incrementAmount;

    if (direction === 1) {
      // Whatever it takes to reach quantity = receivedCount
      if (receivedCount + finalAmount > quantity) {
        var offset = quantity - receivedCount;
        finalAmount = (offset >= 0) ? offset : 0;
      }

    } else {
      // Whatever it takes to not go below 0 receivedCount
      if (receivedCount + finalAmount < 0)
        finalAmount = (receivedCount > 0) ? receivedCount * direction : 0;
    }

    this.setAmount(finalAmount);
  },


  setAmount: function(amount) {
    this.get('controller').send('receivingIncrement', amount);
  },


  stopTimer: function() {
    clearInterval(this.pressTimer);
  },


  willDestroyElement: function() {
    this.stopTimer();
    this._super();
  }
});
