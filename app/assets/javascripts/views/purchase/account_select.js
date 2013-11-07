
App.AccountSelect = Ember.Select.extend({
  viewName: 'select',
  prompt: 'Add New Account',
  optionValuePath: 'content.id',
  optionLabelPath: 'content.number',
  classNames: ['purchase_account_select'],

  change: function(evt) {
    if (this.selection == null) {
      this.send('openNew');
    }
  },

});

