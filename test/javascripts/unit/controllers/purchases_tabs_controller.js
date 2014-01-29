
module('PurchasesTabsController', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/');
  },

  teardown: function() {
    visit('/');
  }
});
