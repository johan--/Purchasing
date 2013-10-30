App.NotesController = Ember.ArrayController.extend({
  itemController: 'note',

  createLine: function() {
    this.pushObject(this.store.createRecord('note'));
  },

  actions: {
    checkForLastLine: function(id) {
      var lastObject = this.get('model.lastObject');

      if (id == lastObject.id && !Ember.isEmpty(lastObject.get('text')))
        this.createLine();
    }
  },
});
