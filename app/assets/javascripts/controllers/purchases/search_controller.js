
App.SearchController = Ember.ArrayController.extend(App.PurchasesTabsControllerMixin, App.SearchControllerMixin, App.PurchasesControllerSorterMixin, {

  queryParams: ['vendor', 'requester', 'department', 'buyer', 'dateRequestedMin', 'dateRequestedMax',
                'datePurchasedMin', 'datePurchasedMax', 'dateExpectedMin', 'dateExpectedMax',
                'includeReceived', 'lines', 'searchPage', 'purSearch', 'sort', 'direction',
                'purType'],

  isSearchResults: true,

  metadata: function() {
    return this.get('content.meta');
  }.property('content.meta'),


  tabs: function() {
    return App.Globals.tabs;
  }.property(),


  actions: {

    tabClick: function(tab) {
      this.newPurPage({ tab: tab, searchPage: 1 });
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
