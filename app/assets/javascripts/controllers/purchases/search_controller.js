
App.SearchController = Ember.ArrayController.extend(App.PurchasesTabsControllerMixin, App.PurchasesControllerSorterMixin, {

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

    startQuickSearch: function(val) {
      if (!isEmpty(val))
        this.transitionToRoute('search', { queryParams: { purSearch: val } });
    },


    startAdvancedSearch: function(vals) {
      Ember.merge(vals, { purSearch: null });
      if (!isEmpty(vals))
        this.transitionToRoute('search', { queryParams: vals });
    },


    page: function(page) {
      this.newPage({ searchPage: page });
      return false;
    },


    newPurchase: function() {
      this.transitionToRoute('purchase.new');
      return false;
    }
  },


  newPage: function(param) {
    this.transitionToRoute({ queryParams: param });
  },
});
