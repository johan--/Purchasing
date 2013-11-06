
App.AccountSelect = Ember.Select.extend({
  viewName: 'select',
  prompt: 'Add New Account',
  optionValuePath: 'content.id',
  optionLabelPath: 'content.number',

  change: function(evt) {
    //id = (this.selection) ? this.selection.id : 'all';
    //this.get('controller').send('buyerUpdate', id);
  }
});
