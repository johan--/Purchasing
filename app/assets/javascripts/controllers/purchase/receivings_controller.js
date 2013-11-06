App.ReceivingsController = Ember.ArrayController.extend({
  itemController: 'receiving',

  allReceived: function() {
    return this.get('purchase.received');
  }.property('purchase.received'),

  isReceiving: function() {
    return !Ember.isEmpty(this.get('content.firstObject.purchase.currentReceivingDoc'))
  }.property('content.firstObject.purchase.currentReceivingDoc'),

  actions: {
    cancelReceiving: function() {
      this.set('content.firstObject.purchase.currentReceivingDoc', null);
    },

    newReceiving: function() {
      var new_rec = this.store.createRecord('receiving'),
          purchase = this.get('content.firstObject.purchase');

      new_rec.set('')
      this.addObject(new_rec);
      purchase.set('currentReceivingDoc', new_rec);
    }
  }

});
