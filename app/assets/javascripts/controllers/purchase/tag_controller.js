App.TagController = Ember.ObjectController.extend({

  actions: {
    deleteRecord: function(dom) {
      var model = this.get('model');
      model.set('destroy', true);
    }
  }
})
