App.SearchBoxView = Ember.View.extend({
  templateName: 'search/searchBox',
  tagName: 'span',
  includeAdvanced: true,

  actions: {
    searchAdvanced: function() {
      $('.advanced_search_box').show();
    },

    startSearch: function() {
      var val = $('.search_box_input').val();
      this.get('controller').send('startSearch', val);
    }
  }
})