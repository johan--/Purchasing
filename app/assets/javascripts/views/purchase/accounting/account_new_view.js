
App.AccountNewView = Ember.View.extend({
  templateName: 'purchase/accounts/new_view',


  willDestroyElement: function() {
    this.$('.modal').modal('destroy');
  },


  actions: {

    newAccountSave: function() {
      this.get('parentView').send('newAccountSave');
    }
  }
});
