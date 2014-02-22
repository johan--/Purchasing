
App.SearchController = Ember.ArrayController.extend(App.PurchasesTabsControllerMixin, App.SearchControllerMixin, App.PurchasesControllerSorterMixin, {

  queryParams: ['vendor', 'requester', 'department', 'buyer', 'dateRequestedMin', 'dateRequestedMax',
                'datePurchasedMin', 'datePurchasedMax', 'dateExpectedMin', 'dateExpectedMax',
                'includeReceived', 'lines', 'searchPage', 'purSearch', 'sort', 'direction',
                'purType', 'searchId'],
  isSearchResults: true,
  metadata: Ember.computed.alias('content.meta'),
  tabs: Ember.computed(function() { return App.Globals.tabs; }),


  actions: {

    tabClick: function(tab) {
      this.newPurPage({ tab: tab, purPage: 1 });
    },


    page: function(page) {
      this.set('searchPage', page);
      return false;
    },


    newPurchase: function() {
      this.transitionToRoute('purchase.new');
      return false;
    }
  },


  newPurPage: function(param) {
    this.transitionToRoute('purchases.tabs', { queryParams: param });
  },


  newPage: function(param) {
    this.transitionToRoute('search', { queryParams: param });
  }
});
