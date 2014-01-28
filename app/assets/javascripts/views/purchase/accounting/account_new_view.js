
App.AccountNewView = Ember.View.extend({
  templateName: 'purchase/accounts/new_view',


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  },


  actions: {

    newAccountSave: function() {
      this.get('parentView').send('newAccountSave');
    }
  }
});
