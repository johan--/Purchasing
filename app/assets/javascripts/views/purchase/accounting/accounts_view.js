
App.AccountsView = Ember.View.extend({
  templateName: 'purchase/accounts/accounts_list',

  didInsertElement: function() {
    var self = this;

    // When Account Add modal opens
    $('#accountAdd').on('shown.bs.modal', function(e){
      self.clearNumber();
    });

  },


  willDestroyElement: function() {
    $('#accountAdd').unbind();
    this._super();
  },


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

    assignAccount: function(acct) {
      this.setAccount(acct);
    },


    newAccountSave: function() {
      var controller = this.get('controller');

      if (this.validateNumbers())
        return;

      $('#accountAdd').modal('hide');
      controller.send('addNewAccount', this.get('getNumber'));
    }
  },


  validateNumbers: function() {
    var doms = [$('.new_fund_field'),
                $('.new_org_field'),
                $('.new_acct_field')],
        self = this,
        thereWereErrors = false;

    $.each(doms, function(i, item){
      var length = (i === 2) ? 5 : 6;

      if (!self.validateField(item, length)) {
        thereWereErrors = true;
      }
    });

    return thereWereErrors;
  },


  validateField: function(field, length) {
    var val = field.val();
    return val.length === length;
  }
});
