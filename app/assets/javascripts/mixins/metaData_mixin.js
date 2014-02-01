
App.MetaDataMixin = Ember.Mixin.create({


  metadata: function() {
    if (this.get('model.isLoaded')) {
      var store = this.store;
      var modelType = this.get('model.type');
      var metadata = store.typeMapFor(modelType).metadata;

      return metadata;
    }
  }.property('model.isLoaded')
});
