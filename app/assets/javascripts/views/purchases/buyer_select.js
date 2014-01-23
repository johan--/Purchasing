
App.BuyerSelect = Ember.Select.extend({
  viewName: 'select',
  prompt: 'All',

  optionValuePath: 'content.id',
  optionLabelPath: 'content.name',
  contentBinding: 'buyersList',
  valueBinding: 'buyerCurrent',


  buyersList: function() {
    return this.get('controller.metadata.buyers');
  }.property('controller.metadata.buyers'),


  buyerCurrent: function() {
    var buyer = this.get('controller.metadata.filterBuyer');
    if (!isEmpty(buyer) && buyer != 'All')
      return parseInt(buyer, 10);
    else
      return 'All';
  }.property('controller.metadata.filterBuyer'),


  change: function(evt) {
    id = (this.selection) ? this.selection.id : 'all';
    this.get('parentView').set('filterBuyer', id);
  }
});
