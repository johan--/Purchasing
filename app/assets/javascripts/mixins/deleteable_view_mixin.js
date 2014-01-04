
App.DeleteableViewMixin = Ember.Mixin.create({

  classNameBindings: ['isDeleted'],

  isDeleted: function() {
    return this.get('controller.model.isDestroy');
  }.property('controller.model.isDestroy'),


  actions: {

    deleteMe: function() {
      var model = this.get('controller.model');

      model.set('isDestroy', !model.get('isDestroy'));
      return false;
    }
  }
});
