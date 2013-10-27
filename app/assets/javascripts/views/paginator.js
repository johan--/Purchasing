App.PaginatorView = Ember.View.extend({
  templateName: 'views/paginator',
  tagName: 'span',

  curPage: function() {
    return this.get('controller').get('metadata.page');
  }.property('controller.metadata'),

  totalPages: function() {
    return this.get('controller').get('metadata.total_pages');
  }.property('controller.metadata'),

  canNext: function() {
    return this.get('curPage') < this.get('totalPages');
  }.property('curPage', 'totalPages'),

  canPrevious: function() {
    return this.get('curPage') > 1;
  }.property('curPage'),

  actions: {
    goNext: function() {
      if (this.get('canNext'))
        this.get('controller').newPage({ page: parseInt(this.get('curPage')) + 1 });
    },

    goPrevious: function() {
      if (this.get('canPrevious'))
        this.get('controller').newPage({ page: parseInt(this.get('curPage')) - 1 });
    }
  },

})
