
module('PurchasesTabsController', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);
    testController = helperMethods.controller('purchases');

    visit('/');
  },

  teardown: function() {
    visit('/');
  }
});
