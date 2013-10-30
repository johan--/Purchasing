App.LineItemsController = Ember.ArrayController.extend({
  itemController: 'line_item',

  createLine: function() {
    this.pushObject(this.store.createRecord('line_item'));
  },

  actions: {
    checkForLastLine: function(id) {
      var lastObject = this.get('model.lastObject');

      if (id == lastObject.id && !Ember.isEmpty(lastObject.get('description')))
        this.createLine();
    }
  },

  contentLoaded: function() {

  }.observes('content.isLoaded')
});
