
App.LineItemsController = Ember.ArrayController.extend({
  itemController: 'line_item',

  isEditing: false,

  createLine: function() {
    this.pushObject(this.store.createRecord('line_item'));
  },


  actions: {
    checkForLastLine: function(id) {
      var lastObject = this.get('model.lastObject');

      this.get('parentController.model').send('becomeDirty');
      if (id === lastObject.id && !isEmpty(lastObject.get('description')))
        this.createLine();
    }
  }
});
