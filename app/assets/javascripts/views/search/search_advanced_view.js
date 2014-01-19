
App.AdvancedSearchBoxView = Ember.View.extend({
  templateName: 'search/advanced_search_box',
  id: 'advanced_search_box',
  classNames: ['advanced_search_box'],

  actions: {

    clearFields: function() {
      this.$('input').val('');
    },


    startAdvancedSearch: function() {
      var params = {
        vendor: this.$('#vendor').val(),
        requester: this.$('#requester').val(),
        buyer: this.$('#buyer').val(),
        dateRequestedMin: this.$('#dateRequested>input[name*="start"]').val(),
        dateRequestedMax: this.$('#dateRequested>input[name*="end"]').val(),
        datePurchasedMin: this.$('#datePurchased>input[name*="start"]').val(),
        datePurchasedMax: this.$('#datePurchased>input[name*="end"]').val(),
        dateExpectedMin: this.$('#dateExpected>input[name*="start"]').val(),
        dateExpectedMax: this.$('#dateExpected>input[name*="end"]').val(),
        lines: this.$('#description').val()
      };

      this.$('modal').modal('hide');
      this.get('controller').send('startAdvancedSearch', params);
    }
  }
});
