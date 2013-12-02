
App.AccountsView = Ember.View.extend({
  templateName: 'purchase/accounts_view',

  didInsertElement: function() {
    this.get('controller').set('isEditingAccounts', false);
    this.closeNew();
  },


  spinnerDom: function() {
    return $('.new_account_spinner');
  }.property(),


  accountNumberText: function() {
    var curAccount = this.get('controller.model.account');
    if (Ember.isEmpty(curAccount))
      return 'New Account';
    else
      return curAccount.get('number');
  }.property('controller.model.account'),


  openNew: function() {
    $('.new_account_fields').removeClass('hidden');
    $('.purchase_account_numbers').addClass('hidden');
    $('.new_account_fields').slideDown();
    this.clearNumber();
  },


  closeNew: function() {
    $('.new_account_fields').addClass('hidden');
    $('.purchase_account_numbers').removeClass('hidden');
  },


  getNumber: function() {
    return $('.new_fund_field').val() + '-' +
           $('.new_org_field').val() + '-' +
           $('.new_acct_field').val();
  }.property(),


  clearNumber: function() {
    $('.new_fund_field').val('101000');
    $('.new_org_field').val('').focus();
    $('.new_acct_field').val('');
  },


  actions: {
    newAccountCancel: function() {
      this.send('stopEditingAccounts');
      this.closeNew();
    },


    newAccountSave: function() {
      var self = this,
          controller = this.get('controller'),
          store = controller.get('store'),
          application = controller.get('application'),
          spinner = this.get('spinnerDom'),
          user = controller.get('requester.id');

      application.clearNotifications();
      spinner.show();

      var payload = { account: { number: this.get('getNumber'), user_id: user } };

      // Manually post because we
      $.ajax({
        type: 'POST',
        url: '/accounts',
        data: payload

       }).then(function(newObject){

        // Push server record (which is clean)
        store.push('account', newObject.account);

        // Build relationship
        pushedNewRec = store.getById('account', newObject.account.id);
        controller.set('account', pushedNewRec);

        application.notify({message: 'Account Added', type: 'notice'});

        spinner.hide();
        self.closeNew();
        self.send('stopEditingAccounts');

      }, function(error) {
        application.notifyWithJSON(error);
        spinner.hide();
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
