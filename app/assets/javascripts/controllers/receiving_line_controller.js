App.ReceivingLineController = Ember.ObjectController.extend({
  needs: 'line_item',

  highlightLineItem: function() {
    console.log('yay');
    console.log(this.get('line_item'));
    console.log('yay');
  }
});
