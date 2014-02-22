
App.PurchasesController = Ember.ArrayController.extend(App.PurchasesControllerSorterMixin, App.SearchControllerMixin, {

  // This controller proxies the real purchases controller so that loading substate does not cause
  // global flicker

  needs: ['application', 'purchasesTabs'],
  purchasesBinding: 'controllers.purchasesTabs',
  applicationBinding: 'controllers.application',


  metadata: Ember.computed.oneWay('purchases.metadata'),
  tabs: Ember.computed(function() { return App.Globals.tabs; }),
  tab: Ember.computed.alias('purchases.tab'),   // Proxy purchases.tabs query param so tabs can remain in context of purchases

  //canTabNew: function() { return this.get('metadata.tab') == 'New'; }.property('metadata.tab'),
  //canTabPurchased: function() { return this.get('metadata.tab') == 'Purchased'; }.property('metadata.tab'),
  //canTabReconciled: function() { return this.get('metadata.tab') == 'Reconciled'; }.property('metadata.tab'),

  numSelected: Ember.computed.alias('purchases.numSelected'),
  itemsSelected: Ember.computed.gt('numSelected', 0),


  actions: {

    page: function(page) {
      this.purchases.set('purPage', page);
      return false;
    },


    newPurchase: function() {
      this.transitionToRoute('purchase.new', { queryParams: { newPurchaseType: this.purchases.get('purType') }});
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
      var buyer_id = this.get('assignBuyer.id');
      this.purchases.assignSelected(buyer_id);
    },

    reconcileSelected: function() {
      this.purchases.reconcileSelected();
    },


    unreconcileSelected: function() {
      this.purchases.unreconcileSelected();
    }
  },


  newPage: function(param) {
    this.transitionToRoute('purchases.tabs', { queryParams: param });
  }
});
