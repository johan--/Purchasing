
App.UsersAccountsView = Ember.View.extend({
  templateName: 'users/accounts_view',


  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  }
});
