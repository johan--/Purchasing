
App.BuyerSelect = Ember.Select.extend({
  viewName: 'select',
  prompt: 'All',

  optionValuePath: 'content.id',
  optionLabelPath: 'content.name',
  contentBinding: 'buyersList',
  valueBinding: 'buyerCurrent',


  buyersList: function() {
    return App.Globals.buyers;
  }.property(),


  buyerCurrent: function(key, value) {
    var buyer = App.current_user.id;

    if (arguments.length > 1)
      return;

    if (isEmpty(buyer))
      return 'All';
    else
      return parseInt(buyer, 10);
  }.property(),


  change: function(evt) {
    var obj = this.selection;
    this.set('value', obj);
  }
});
