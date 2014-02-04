
App.PurchaseHoverDocView = Ember.View.extend({
  classNames: ['purchase_row_hover', 'hidden-xs', 'col-sm-8'],
  templateName: 'purchases/row_hover',

  didInsertElement: function() {
    this.$().css('visibility', 'hidden');
  },


  contentObserver: function() {
    var content = this.get('content');

    if (isEmpty(content)) {
      this.$().css('visibility', 'hidden');
    } else {

      // TODO: There is an odd situation where content is sometimes being set to recordArray
      if (content.get('length') > 1)
        return;

      this.$().css('visibility', 'visible');
    }
  }.observes('content'),


  actions: {

    closeMe: function() {
      // Clear content (which is bound to controller) so that only the observer controls visibility
      this.set('content', null);
    }
  }

});
