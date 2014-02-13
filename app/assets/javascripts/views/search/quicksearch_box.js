
App.QuickSearchBoxView = Ember.View.extend({
  templateName: 'search/quickSearchBox',
  tagName: 'span',
  includeAdvanced: true,

  value: null,

  actions: {

    searchAdvanced: function() {
      $('#advancedSearchModal').modal('show');
    },


    startSearch: function() {
      // This is only called from the search button
      var val = this.$('input').val();

      if (!isEmpty(val))
        this.get('controller').send('startQuickSearch', val);
    }
  }
});
