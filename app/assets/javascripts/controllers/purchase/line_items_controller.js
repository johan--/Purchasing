App.LineItemsController = Ember.ArrayController.extend({
  itemController: 'line_item',

  isEditing: false,

  createLine: function() {
    this.pushObject(this.store.createRecord('line_item'));
  },


  isNotReceiving: function() {
    return !this.get('content.firstObject.purchase.currentReceivingDoc');
  }.property('content.firstObject.purchase.currentReceivingDoc'),


  actions: {
    checkForLastLine: function(id) {
      var lastObject = this.get('model.lastObject');

      if (id == lastObject.id && !Ember.isEmpty(lastObject.get('description')))
        this.createLine();
    }
  }
});
