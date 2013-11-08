
App.AccountsView = Ember.View.extend({
  templateName: 'purchase/accounts_view',

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
    // TODO: Set account selector to default val
  },

  actions: {
    newAccountCancel: function() {
      console.log('account cancel');
      this.closeNew();
    },

    newAccountSave: function() {
      console.log('account save');

      // Create record in store
      // Save
      // If successful, set ID for purchase
      // If fail notify why

      return;

      separator = "-";
      new_account = $('.new_fund_field').val() + separator + $('.new_org_field').val() + separator + $('.new_acct_field').val();
      user_id = $('.account').data('user');
      this.showLoading();
      $.post('/account/new?user=' + user_id + '&account=' + new_account, null, null, 'script');
    }
  }
});
