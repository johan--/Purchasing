
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
    var buyer = this.get('controller.metadata.buyer');
    if (!Ember.isEmpty(buyer) && buyer != 'All')
      return parseInt(buyer);
    else
      return 'All';
  }.property('controller.metadata.buyer'),

  change: function(evt) {
    id = (this.selection) ? this.selection.id : 'all';
    this.get('parentView').set('buyer', id);
  }
});
