
App.AccountsView = Ember.View.extend({
  templateName: 'purchase/accounts_view',

  didInsertElement: function() {
    var self = this;

    // When Account Add modal opens
    $('#accountAdd').on('shown.bs.modal', function(e){
      self.clearNumber();
    });

  },


  spinnerDom: function() {
    return $('.new_account_spinner');
  }.property(),


  accountsList: function() {
    return this.get('controller.store').all('account');
  }.property('controller.store.account'),


  accountNumberText: function() {
    var curAccount = this.get('controller.model.account.number');
    if (Ember.isEmpty(curAccount))
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
      var model = this.get('controller.model');

      model.set('account', acct);
      model.send('becomeDirty');
    },


    newAccountSave: function() {
      var self = this,
          controller = this.get('controller'),
          store = controller.get('store'),
          application = controller.get('application'),
          spinner = this.get('spinnerDom'),
          user = controller.get('requester.id');

      application.clearNotifications();

      if (this.validateNumbers())
        return;

      spinner.show();

      var payload = { account: { number: this.get('getNumber'), user_id: user } };

      $.ajax({
        type: 'POST',
        url: '/accounts',
        data: payload

      }).then(function(newObject){
        if (newObject) {
          // Push server record (which is clean)
          store.push('account', newObject.account);

          // Build relationship
          pushedNewRec = store.getById('account', newObject.account.id);
          controller.set('account', pushedNewRec);

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
