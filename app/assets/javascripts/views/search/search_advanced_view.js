App.AdvancedSearchBoxView = Ember.View.extend({
  templateName: 'search/advanced_search_box',
  id: 'advanced_search_box',
  classNames: ['advanced_search_box'],

  didInsertElement: function() {
    this.$().hide();
  },

  closeSearch: function() {
    this.$().hide();
  },

  actions: {
    closeSearch: function() {
      this.$().hide();
    }
  }

})
