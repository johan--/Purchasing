
App.AccountSelect = Ember.Select.extend({
  viewName: 'select',
  classNames: ['purchase_account_select'],
  prompt: 'Add New Account',

  optionValuePath: 'content.id',
  optionLabelPath: 'content.number',
  contentBinding: 'accountsList',
  selectionBinding: 'accountCurrent',

  accountsList: function() {
    console.log('accounts');
    return this.get('controller.store').all('account');
  }.property('controller.store.account'),

  accountCurrent: function() {
    var account = this.get('controller.model.account');

    if (!Ember.isEmpty(account)) {
      console.log(parseInt(account.id));
      return parseInt(account.id);
    }
  }.property('controller.model.account'),

  change: function(evt) {
    if (Ember.isEmpty(this.selection))
      this.get('parentView').openNew();
    else
      this.get('controller').set('account', this.selection);
  },

});

