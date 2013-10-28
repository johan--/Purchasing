
App.PurchaseLineItemView = Ember.View.extend({
  templateName: 'purchase/line_item',

  actions: {
    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
    }
  }
})
