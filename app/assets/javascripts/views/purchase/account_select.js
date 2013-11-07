
App.AccountSelect = Ember.Select.extend({
  viewName: 'select',
  classNames: ['purchase_account_select'],
  prompt: 'Add New Account',

  optionValuePath: 'content.id',
  optionLabelPath: 'content.number',
  contentBinding: 'accountsList',
  valueBinding: 'defaultAccount',

  defaultAccount: function() {
    var account = this.get('controller.account');
    if (!Ember.isEmpty(account))
      return parseInt(account.id);
  }.property('controller.account'),

  accountsList: function() {
    return this.get('controller.accounts'); // More evil!!
  }.property('controller.accounts'),

  change: function(evt) {
    if (this.selection == null) {
      this.send('openNew');
    }
  },

});

