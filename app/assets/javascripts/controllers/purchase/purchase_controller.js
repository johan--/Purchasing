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


  canHaveActionControls: function() {
    var tab = this.get('metadata.tab');
    return tab === 'New' || tab === 'Purchased' || tab === 'Reconciled';
  }.property('metadata'),


  actions: {

    selectRecord: function() {
      this.set('isSelected', !this.get('isSelected'));
    },
  }
});
