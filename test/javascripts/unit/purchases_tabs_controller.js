
var testController = null;

module('PurchasesTabsController', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);
    testController = helperMethods.controller('purchases');
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});

