
App.AccountsView = Ember.View.extend({
  templateName: 'purchase/accounts_view',

  accountNumberText: function() {
    var curAccount = this.get('controller.model.account'),
        curNumber = curAccount.get('number');

    console.log(curAccount);
    console.log(curNumber);
    if (Ember.isEmpty(curNumber))
      return 'New Account';
    else
      return curNumber
  }.property('controller.model.account'),

  showLoading: function() {
    $('.new_account_loading').removeClass('hidden');
  },

  hideLoading: function() {
    $('.new_account_loading').addClass('hidden');
  },

  openNew: function() {
    console.log('opening new');
    $('.new_account_fields').removeClass('hidden');
    $('.purchase_account_numbers').addClass('hidden');
    $('.new_account_fields').slideDown();
  },

  closeNew: function() {
    this.hideLoading();
    $('.new_account_fields').addClass('hidden');
    $('.purchase_account_numbers').removeClass('hidden');
  },

  actions: {
    newAccountCancel: function() {
      this.get('controller').send('stopEditingAccounts');
      this.closeNew();
    },

    newAccountSave: function() {
      var controller = this.get('controller'),
          separator = "-",
          newAccountNumber = $('.new_fund_field').val() + separator + $('.new_org_field').val() + separator + $('.new_acct_field').val(),
          newAccountRec = controller.get('store').createRecord('account');

      newAccountRec.set('number', newAccountNumber);

      controller.set('account', newAccountRec);
      controller.send('stopEditingAccounts');
      this.closeNew();
    }
  }
});
