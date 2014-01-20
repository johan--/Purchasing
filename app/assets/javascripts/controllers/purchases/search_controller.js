
App.SearchController = Ember.ArrayController.extend(App.PurchasesControllerMixin, {

  queryParams: ['vendor', 'requester', 'buyer', 'dateRequestedMin', 'dateRequestedMax',
                'datePurchasedMin', 'datePurchasedMax', 'dateExpectedMin', 'dateExpectedMax',
                'lines', 'searchPage', 'quickSearch', 'sort', 'direction'],

  metadata: function() {
    return this.get('content.meta');
  }.property('content.meta'),


});
