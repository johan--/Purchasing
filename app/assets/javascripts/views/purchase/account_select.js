
App.AccountSelect = Ember.Select.extend({
  viewName: 'select',
  classNames: ['purchase_account_select'],
  prompt: 'Add New Account',

  optionValuePath: 'content.id',
  optionLabelPath: 'content.number',
  contentBinding: 'accountsList',
  valueBinding: 'accountCurrent',

  accountsList: function() {
    return this.get('controller.store').all('account');
  }.property('controller.store.account'),

  accountCurrent: function() {
    var account = this.get('controller.model.account');

    if (!Ember.isEmpty(account))
      return account.id;
  }.property('controller.model.account'),

  change: function(evt) {
    if (Ember.isEmpty(this.selection)) {
      this.get('parentView').openNew();
    } else {
      this.get('controller').set('account', this.selection);
      this.get('controller').send('stopEditingAccounts');
    }
  }
});

