
App.receivingRec = Ember.View.extend({
  templateName: 'receiving_rec',

  click: function() {
    this.get("controller").send("clickReceiving", this);
  },

  mouseEnter: function() {
    this.get("controller").send("startHover", this);
  },
  mouseLeave: function() {
    this.get("controller").send("stopHover", this);
  }
});
