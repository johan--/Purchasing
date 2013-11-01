App.TagController = Ember.ObjectController.extend({

  actions: {
    deleteRecord: function(dom) {
      model = this.get('model');
      model.set('destroy', true);
    }
  }
})
