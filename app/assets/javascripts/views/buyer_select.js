
App.BuyerSelect = Ember.Select.extend({
  change: function(evt) {
    id = (this.selection) ? this.selection.id : 'all';
    this.get('controller').send('buyerUpdate', id);
  }
});
