App.ReceivingLinesController = Ember.ArrayController.extend({
  itemController: 'receiving_line',

  totalItems: function() {
    var res = 0;
    this.get('quantity').forEach(function(val){
      res += val;
    });
    return res;
  }.property('@each.quantity')
});
