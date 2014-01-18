
App.AdvancedSearchBoxView = Ember.View.extend({
  templateName: 'search/advanced_search_box',
  id: 'advanced_search_box',
  classNames: ['advanced_search_box'],

  actions: {

    clearFields: function() {
      this.$('input').val('');
    },


    startAdvancedSearch: function() {
      //TODO these should be metadata bindings so they autofill
      var params = {
        vendor: $('#vendor').val(),
        requester: $('#requester').val(),
        buyer: $('#buyer').val(),
        dateRequested: $('#dateRequested').val(),
        datePurchased: $('#datePurchased').val(),
        dateExpected: $('#dateExpected').val(),
        lines: $('#description').val()
      };

      this.$().hide();
      this.get('controller').send('startAdvancedSearch', params);
    }
  }
});
