App.PurchaseController = Ember.ObjectController.extend(App.ControllerSaveAndDeleteMixin, App.PurchaseControllerMixin, {

  buyerInitials: function() {
    var buyer = this.get('buyer'),
        res = '';

    if (!Ember.isEmpty(buyer)) {
      var buyerArray = buyer.name.split(' ');

      for(i = 0; i < buyerArray.length; i++)
        res += buyerArray[i][0].toUpperCase();
    }

    return res;
  }.property('buyer'),


  title: function() {
    var self = this,
        lines = this.get('lineItems');

    if (lines) {
      return lines.reduce(function(result, line){
        var line_class = self.getClassForLineItemTooltip(line);

        return result += '<li class="' + line_class + '">' + line.get('description') || '' + '</li>';
      }, '<ul class="row_tooltip">');
    }
  }.property('lineItems.@each'),


  canHaveActionControls: function() {
    var tab = this.get('metadata.tab');
    return tab === 'New' || tab === 'Purchased' || tab === 'Reconciled';
  }.property('metadata'),


  actions: {

    selectRecord: function() {
      this.set('isSelected', !this.get('isSelected'));
    },
  },


  getClassForLineItemTooltip: function(line) {
    var quantity = line.get('quantity') || 0,
        received = line.get('received_count_server') || 0;

    if (quantity === 0 || received === 0)
      return '';
    else if (received >= quantity)
      return 'complete';
    else
      return 'partial';
  }
});
