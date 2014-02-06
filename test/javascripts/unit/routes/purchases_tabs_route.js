
module('PurchasesTabsRoute', {
  setup: function() {
    // Build fixtures
    injectFixtures();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {

  }
});
