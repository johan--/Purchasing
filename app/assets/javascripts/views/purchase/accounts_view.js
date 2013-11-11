
App.AccountsView = Ember.View.extend({
  templateName: 'purchase/accounts_view',

  accountNumberText: function() {
    var curAccount = this.get('controller.model.account');
    if (Ember.isEmpty(curAccount))
      return 'New Account';
    else
      return curAccount.get('number');
  }.property('controller.model.account'),

  showLoading: function() {
    $('.new_account_loading').removeClass('hidden');
  },

  hideLoading: function() {
    $('.new_account_loading').addClass('hidden');
  },

  openNew: function() {
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
      this.send('stopEditingAccounts');
      this.closeNew();
    },

    newAccountSave: function() {
      var self = this,
          controller = this.get('controller'),
          separator = "-",
          newAccountNumber = $('.new_fund_field').val() + separator + $('.new_org_field').val() + separator + $('.new_acct_field').val(),
          newAccountRec = controller.get('store').createRecord('account');

      newAccountRec.set('number', newAccountNumber);
      newAccountRec.set('user_id', controller.get('requester').id);

      controller.get('application').clearNotifications();

      newAccountRec.save().then(function(){
        controller.get('application').notify({message: 'Account Added', type: 'notice'});
        controller.set('account', newAccountRec);
        self.send('stopEditingAccounts');
        self.closeNew();

      }, function(error) {
        newAccountRec.rollback();
        controller.get('application').notifyWithJSON(error);
      });
    },

    startEditingAccounts: function() {
      this.get('controller').set('isEditingAccounts', true);
      if (Ember.isEmpty(this.get('controller.model.account'))) {
        // First check if there any accounts
        var numAccounts = this.get('controller.store').all('account');

        if (numAccounts.get('length') < 1)
          this.openNew();
      }
    },

    stopEditingAccounts: function() {
      this.get('controller').set('isEditingAccounts', false);
    },

    addNewAccount: function() {
      this.openNew();
    }
  }
});
