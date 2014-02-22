
App.DeleteableViewMixin = Ember.Mixin.create({

  classNameBindings: ['isDeleted'],
  isDeleted: Ember.computed.bool('controller.model.isDestroy'),

  actions: {

    deleteMe: function() {
      this.get('controller.model').toggleProperty('isDestroy');
    }
  }
});
