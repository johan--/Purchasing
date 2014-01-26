
App.PurchasesController = Ember.ArrayController.extend(App.PurchasesControllerSorterMixin, {

  // This controller proxies the real purchases controller so that loading substate does not cause
  // global flicker

  needs: ['application', 'purchasesTabs'],
  purchasesBinding: 'controllers.purchasesTabs',
  applicationBinding: 'controllers.application',


  metadata: function() {
    return this.get('purchases.metadata');
  }.property('purchases.metadata'),


  tabs: function() {
    return App.Globals.tabs;
  }.property(),


  Pending: function() {
    return 'active';
  }.property(),

  numSelected: function() {
    return this.get('purchases.numSelected');
  }.property('purchases.numSelected'),


  itemsSelected: function() {
    return this.get('numSelected') > 0;
  }.property('numSelected'),


  actions: {

    startQuickSearch: function(val) {
      if (!isEmpty(val))
        this.transitionToRoute('search', { queryParams: { purSearch: val } });
    },


    startAdvancedSearch: function(vals) {
      if (!isEmpty(vals))
        this.transitionToRoute('search', { queryParams: vals });
    },


    page: function(page) {
      this.purchases.set('purPage', page);
      return false;
    },


    newPurchase: function() {
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
  },

  newPage: function(param) {
    this.transitionToRoute({ queryParams: param });
  },
});
