
App.BuyerSelect = Ember.Select.extend({
  viewName: 'select',
  prompt: 'All',
  valueBinding: 'buyerCurrent',
  contentBinding: 'buyersList',
  optionValuePath: 'content.id',
  optionLabelPath: 'content.name',

  buyersList: function() {
    return eval(this.get('controller.metadata.buyers')); // EVIL
  }.property('controller.metadata.buyers'),

  buyerCurrent: function() {
    return parseInt(this.get('controller.metadata.buyer'));
  }.property('controller.metadata.buyer'),

  change: function(evt) {
    id = (this.selection) ? this.selection.id : 'all';
    this.get('controller').send('buyerUpdate', id);
  }
});
