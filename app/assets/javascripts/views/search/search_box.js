
App.SearchBoxView = Ember.View.extend({
  templateName: 'search/searchBox',
  tagName: 'span',
  includeAdvanced: true,


  actions: {

    searchAdvanced: function() {
      $('#advancedSearchModal').modal('show');
    },


    startSearch: function() {
      var val = this.$('input').val();
      this.get('controller').send('startSearch', val);
    }
  }
});
