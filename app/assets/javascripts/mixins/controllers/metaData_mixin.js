
App.MetaDataMixin = Ember.Mixin.create({

  metadata: function() {
    if (this.get('model.isLoaded')) {
      var modelType = this.get('model.type');
      var metadata = this.store.typeMapFor(modelType).metadata;

      return metadata;
    }
  }.property('model.isLoaded')
});
