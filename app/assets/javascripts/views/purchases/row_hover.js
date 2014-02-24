
App.PurchaseHoverDocView = Ember.View.extend({

  classNames: ['purchase_row_hover', 'hidden-xs', 'col-sm-8'],
  templateName: 'purchases/row_hover',

  classNameBindings: ['invisible'],
  invisible: Ember.computed('content', function() { return isEmpty(this.get('content')); }),


  actions: {

    closeMe: function() {
      // Clear content (which is bound to controller) so that only the observer controls visibility
      this.set('content', null);
    }
  }

});
