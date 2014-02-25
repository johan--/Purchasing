
App.ReceivingGlobals = Ember.Object.create({
  currentReceivingDoc: null,
  currentReceivingHoverDoc: null,

  resetObject: function() {
    this.set('currentReceivingDoc', null);
    this.set('currentReceivingHoverDoc', null);
  }
});
