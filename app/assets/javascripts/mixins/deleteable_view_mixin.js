App.DeleteableViewMixin = Ember.Mixin.create({

  classNames: ['line_item'],
  classNameBindings: ['isDeleted'],

  isDeleted: function() {
    return this.get('controller.model.destroy');
  }.property('controller.model.destroy'),

  actions: {
    deleteMe: function() {
      model = this.get('controller.model');
      model.set('destroy', !model.get('destroy'));
    }
  }

})
