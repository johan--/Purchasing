App.SearchBoxView = Ember.View.extend({
  templateName: 'search/searchBox',
  tagName: 'span',
  includeAdvanced: true,

  actions: {
    searchAdvanced: function() {
      $('.advanced_search_box').show();
    }
  }
})
