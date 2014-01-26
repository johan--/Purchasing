
App.QuickSearchBoxView = Ember.View.extend({
  templateName: 'views/quickSearchBox',
  tagName: 'span',
  includeAdvanced: true,


  actions: {

    searchAdvanced: function() {
      $('#advancedSearchModal').modal('show');
    },


    startSearch: function() {
      // This is only called from the search button
      var val = this.$('input').val();
      this.get('controller').send('startQuickSearch', val);
    }
  }
});
