
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
  canTabReconciled: function() { return this.canTab('Reconciled'); }.property('metadata'),
  canTabCancelled:  function() { return this.canTab('Cancelled');  }.property('metadata'),
  canTabStarred:    function() { return this.canTab('Starred');    }.property('metadata'),
  canTab: function(tab) {
    return this.get('metadata.tab') === tab;
  },


  numSelected: function() {
    return this.get('purchases.numSelected');
  }.property('purchases.numSelected'),


  itemsSelected: function() {
    return this.get('numSelected') > 0;
  }.property('numSelected'),


  sortDate:         function(){ return this.findSort('dateRequested');        }.property('metadata'),
  sortVendor:       function(){ return this.findSort('vendorString');         }.property('metadata'),
  sortRequester:    function(){ return this.findSort('requester.name');       }.property('metadata'),
  sortDepartment:   function(){ return this.findSort('requester.department'); }.property('metadata'),
  sortBuyer:        function(){ return this.findSort('buyer.name');           }.property('metadata'),
  findSort: function(field) {
    return this.get('currentSortFieldName') == field;
  },


  currentSortFieldName: function() {
    return this.get('metadata.sort');
  }.property('metadata.sort'),


  currentSortIsAscending: function() {
    return this.get('metadata.direction') == 'ASC';
  }.property('metadata.direction'),


  sortDescending: function(){
    if (this.get('currentSortIsAscending'))
      return 'fa fa-sort-up fa-stack-1x';
    else
      return 'fa fa-sort-down fa-stack-1x';
  }.property('currentSortIsAscending'),


  actions: {

    startSearch: function(val) {
      if (!isEmpty(val))
        this.transitionToRoute('search', { queryParams: { quickSearch: val } });
    },


    startAdvancedSearch: function(vals) {
      if (!isEmpty(vals))
        this.transitionToRoute('search', { queryParams: vals });
    },


    page: function(page) {
      this.purchases.newPage({ purPage: page });
      return false;
    },


    tabClick: function(tab) {
      this.purchases.newPage({ tab: tab, purPage: 1 });
      return false;
    },


    sortClick: function(field) {
      cur_sort = this.get('metadata.sort');
      cur_dir = this.get('metadata.direction');

      if (cur_sort === field)
        dir = (cur_dir === 'ASC') ? 'DESC' : 'ASC';
      else
        dir = (field === 'dateRequested') ? 'DESC' : 'ASC';

      this.purchases.newPage({ sort: field, direction: dir, purPage: 1 });
      return false;
    },


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
