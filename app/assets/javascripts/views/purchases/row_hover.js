
App.PurchaseHoverDocView = Ember.View.extend({
  classNames: ['purchase_row_hover', 'hidden-xs'],
  templateName: 'purchases/row_hover',

  didInsertElement: function() {
    this.$().css('visibility', 'hidden');
  },


  contentObserver: function() {
    if (isEmpty(this.get('content')))
      this.$().css('visibility', 'hidden');
    else
      this.$().css('visibility', 'visible');
  }.observes('content'),


  actions: {

    closeMe: function() {
      this.$().css('visibility', 'hidden');
    }
  }

});
