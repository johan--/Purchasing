App.SearchBoxView = Ember.View.extend({
  templateName: 'search/searchBox',
  tagName: 'span',
  includeAdvanced: true,

  actions: {
    searchAdvanced: function() {
      $('.advanced_search_box').show();
    },

    startSearch: function() {
      var val = this.get('controller.metadata.search');
      this.get('controller').send('startSearch', val);
    }
  }
})
