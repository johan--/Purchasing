App.LineItemsController = Ember.ArrayController.extend({
  itemController: 'line_item',
  needs: 'purchaseEdit',
  purchaseBinding: 'controllers.purchaseEdit',

  isEditing: false,

  createLine: function() {
    this.pushObject(this.store.createRecord('line_item'));
  },


  isReceiving: function() {
    return !!this.get('purchase.currentReceivingDoc');
  }.property('purchase.currentReceivingDoc'),


  isNotReceiving: function() {
    return !this.get('isReceiving');
  }.property('isReceiving'),


  actions: {
    checkForLastLine: function(id) {
      var lastObject = this.get('model.lastObject');

      if (id == lastObject.id && !Ember.isEmpty(lastObject.get('description')))
        this.createLine();
    }
  }
});
