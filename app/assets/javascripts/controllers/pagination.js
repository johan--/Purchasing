var get = Ember.get;
App.PaginationSupport = Ember.Mixin.create({
  metadata: function() {
    if (this.get('model.isLoaded')) {
      var store = this.get('store');
      modelType = this.get('model.type');
      var metadata = store.typeMapFor(modelType).metadata;
      return metadata;
    }
  }.property('model.isLoaded'),

  curPage: function() {
    return this.get('metadata.page');
  }.property('metadata'),

  totalPages: function() {
    return this.get('metadata.total_pages');
  }.property('metadata'),

  canNext: function() {
    return this.get('curPage') < this.get('totalPages');
  }.property('curPage', 'totalPages'),

  canPrevious: function() {
    return this.get('curPage') > 1;
  }.property('curPage'),

  actions: {
    goNext: function() {
      if (this.get('canNext'))
        this.newPage({ page: parseInt(this.get('curPage')) + 1 });
    },

    goPrevious: function() {
      if (this.get('canPrevious'))
        this.newPage({ page: parseInt(this.get('curPage')) - 1 });
    }
  },

});
