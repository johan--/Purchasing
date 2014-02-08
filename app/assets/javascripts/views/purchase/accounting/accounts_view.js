
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
      var self = this,
          controller = this.get('controller'),
          store = controller.store,
          application = controller.get('application'),
          spinner = this.get('spinnerDom'),
          user = controller.get('requester.id');

      if (this.validateNumbers())
        return;

      spinner.show();

      var payload = { account: { number: this.get('getNumber'), user_id: user } };

      $.ajax({
        type: 'POST',
        url: App.Globals.namespace + '/accounts',
        data: payload
      }).then(function(newObject){

        if (newObject) {
          // Push server record (which is clean)
          store.push('account', newObject.account);

          // Build relationship
          var newAccount = store.getById('account', newObject.account.id);
          self.setAccount(newAccount);

        } else {
          application.notify({message: 'There was an error reading the response from the server', type: 'error'});
        }

        spinner.hide();
        $('#accountAdd').modal('hide');

      }, function(error) {

        application.notify(error, 'error');
        spinner.hide();

      });
    }
  },


  setAccount: function(acct) {
    var model = this.get('controller.model');
    model.set('account', acct);
    model.send('becomeDirty');
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
