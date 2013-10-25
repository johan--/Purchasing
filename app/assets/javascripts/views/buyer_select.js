
App.BuyerSelect = Ember.Select.extend({
  viewName: 'select',
  prompt: 'All',
  optionValuePath: 'content.id',
  optionLabelPath: 'content.name',

  change: function(evt) {
    id = (this.selection) ? this.selection.id : 'all';
    this.get('controller').send('buyerUpdate', id);
  }
});
