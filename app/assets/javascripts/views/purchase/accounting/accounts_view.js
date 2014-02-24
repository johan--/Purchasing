
App.AccountsView = Ember.View.extend({

  templateName: 'purchase/accounts/accounts_list',

  spinnerDom: function() {
    return $('.new_account_spinner');
  }.property(),


  accountsList: function() {
    return this.get('controller.store').all('account');
  }.property('controller.store.account'),


  accountNumberText: function() {
    var curAccount = this.get('controller.model.account.number');
    if (isEmpty(curAccount))
      return 'New Account';
    else
      return curAccount;
  }.property('controller.model.account'),


  actions: {

    assignAccount: function(acct) {
      var model = this.get('controller.model');
      model.set('account', acct);
      model.send('becomeDirty');
    }
  }
});
