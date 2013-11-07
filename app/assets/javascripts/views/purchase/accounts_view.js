
App.AccountsView = Ember.View.extend({
  templateName: 'purchase/accounts_view',

  openNew: function() {
    $('.new_account_fields').removeClass('hidden');
    $('.purchase_account_select').addClass('hidden');
    $('.new_org_field').val('');
    $('.new_acct_field').val('');
    $('.new_account_fields').slideDown();
  },

  closeNew: function() {
    this.hideLoading();
    $('.new_account_fields').addClass('hidden');
    $('.purchase_account_select').removeClass('hidden');
    // TODO: Set account selector to default val
  },

  showLoading: function() {
    $('.new_account_loading').removeClass('hidden');
  },

  hideLoading: function() {
    $('.new_account_loading').addClass('hidden');
  },

  actions: {
    newAccountCancel: function() {
      this.closeNew();
    },

    newAccountSave: function() {
      separator = "-";
      new_account = $('.new_fund_field').val() + separator + $('.new_org_field').val() + separator + $('.new_acct_field').val();
      user_id = $('.account').data('user');
      this.showLoading();
      $.post('/account/new?user=' + user_id + '&account=' + new_account, null, null, 'script');
    }
  }
});
