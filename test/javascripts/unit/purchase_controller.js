
var testRoute = null;

module('PurchaseController', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});


function setupMockRoute(){
  testRoute = helperMethods.route('purchases.edit');
  testRoute.reopen({
    transitionTo: function(url, params) {
      Ember.merge(mockResults, { url: url, params: params });
      this._super(url, params);
     },

    replaceWith: function(url, params) {
      Ember.merge(mockResults, { url: url, params: params });
      this._super(url, params);
    }
  });
}

test('Hovering a receiving document', function(){
  expect(0);
});
