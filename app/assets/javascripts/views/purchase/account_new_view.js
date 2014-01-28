
App.AccountNewView = Ember.View.extend({
  templateName: 'purchase/account_new_view',


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  },


  actions: {

    newAccountSave: function() {
      this.get('parentView').send('newAccountSave');
    }
  }
});
