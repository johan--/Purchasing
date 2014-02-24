
App.QuickSearchBoxView = Ember.View.extend({
  templateName: 'search/quickSearchBox',
  tagName: 'span',
  includeAdvanced: true,

  value: null, // Value from controller (only is used on search controller)
  inputValue: null, // Input binding (so we don't write to parent)

  valueObserver: function() {
    this.set('inputValue', this.get('value'));
  }.observes('value').on('init'),

  actions: {

    searchAdvanced: function() {
      $('#advancedSearchModal').modal('show');
    },


    startSearch: function() {
      this.get('controller').send('startQuickSearch', this.get('inputValue'));
    }
  }
});
