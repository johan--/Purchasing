
App.SearchController = Ember.ArrayController.extend(App.PurchasesTabsControllerMixin, App.SearchControllerMixin, App.PurchasesControllerSorterMixin, {

  queryParams: ['vendor', 'requester', 'buyer', 'dateRequestedMin', 'dateRequestedMax',
                'datePurchasedMin', 'datePurchasedMax', 'dateExpectedMin', 'dateExpectedMax',
                'includeReceived', 'lines', 'searchPage', 'purSearch', 'sort', 'direction'],

  isSearchResults: true,

  metadata: function() {
    return this.get('content.meta');
  }.property('content.meta'),


  tabs: function() {
    return App.Globals.tabs;
  }.property(),


  actions: {

    tabClick: function(tab) {
      this.newPage({ tab: tab, searchPage: 1 });
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


  newPage: function(param) {
    this.transitionToRoute('purchases.tabs', { queryParams: param });
  }
});
