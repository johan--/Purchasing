
App.PurchasesController = Ember.ArrayController.extend({

  // This controller proxies the real purchases controller so that loading substate does not cause
  // global flicker

  needs: ['application', 'purchasesTabs'],
  purchasesBinding: 'controllers.purchasesTabs',
  applicationBinding: 'controllers.application',


  metadata: function() {
    return this.get('purchases.metadata');
  }.property('purchases.metadata'),


  canTabNew:        function() { return this.canTab('New');        }.property('metadata'),
  canTabPending:    function() { return this.canTab('Pending');    }.property('metadata'),
  canTabPurchased:  function() { return this.canTab('Purchased');  }.property('metadata'),
  canTabCancelled:  function() { return this.canTab('Cancelled');  }.property('metadata'),
  canTabReconciled: function() { return this.canTab('Reconciled'); }.property('metadata'),
  canTab: function(tab) {
    return this.get('metadata.tab') == tab;
  },


  numSelected: function() {
    return this.get('purchases.numSelected');
  }.property('purchases.numSelected'),


  itemsSelected: function() {
    return this.get('numSelected') > 0;
  }.property('numSelected'),


  actions: {
    newPurchase: function() {
      this.application.clearNotifications();
      this.transitionToRoute('purchase.new');
      return false;
    },


    stopActivities: function() {
      this.purchases.stopAllActivities();
      this.purchases.clearSelected();
    },


    selectAll: function() {
      this.purchases.stopAllActivities();
      this.purchases.selectAll();
    },


    selectNone: function() {
      this.purchases.stopAllActivities();
    },


    assignSelected: function() {
      var buyer_id = this.get('assignBuyer');
      this.purchases.assignSelected(buyer_id);
    },


    reconcileSelected: function() {
      this.purchases.reconcileSelected();
    },



    unreconcileSelected: function() {
      this.purchases.unreconcileSelected();
    }
  }
});
