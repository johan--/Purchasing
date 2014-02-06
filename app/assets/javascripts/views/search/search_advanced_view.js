
App.AdvancedSearchBoxView = Ember.View.extend({
  templateName: 'views/advanced_search_box',
  id: 'advanced_search_box',
  classNames: ['advanced_search_box'],


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  },


  actions: {

    clearFields: function() {
      this.$('input').val('');
      this.$('input[type="checkbox"]').prop('checked', false);
    },


    startAdvancedSearch: function() {
      if (isEmpty(this.getAllVals()))
        return;

      var params = {
        vendor: this.$('#vendor').val(),
        requester: this.$('#requester').val(),
        department: this.$('#department').val(),
        buyer: this.$('#buyer').val(),
        dateRequestedMin: this.$('#dateRequested>input[name*="start"]').val(),
        dateRequestedMax: this.$('#dateRequested>input[name*="end"]').val(),
        datePurchasedMin: this.$('#datePurchased>input[name*="start"]').val(),
        datePurchasedMax: this.$('#datePurchased>input[name*="end"]').val(),
        dateExpectedMin: this.$('#dateExpected>input[name*="start"]').val(),
        dateExpectedMax: this.$('#dateExpected>input[name*="end"]').val(),
        includeReceived: this.$('#includeReceived').prop('checked'),
        lines: this.$('#lines').val(),
        searchPage: 1
      };

      this.closeModal();
      this.get('controller').send('startAdvancedSearch', params);
    },


    closeModal: function() {
      this.closeModal();
    }
  },


  closeModal: function() {
    this.$('.modal').modal('hide');
  },


  getAllVals: function() {
    var vals = this.$('input');

    var valArray = vals.each(function(){
      var val = $(this).val();
      if (!isEmpty(val))
        vals.push(val);
    });

    return valArray.length;
  }

});
