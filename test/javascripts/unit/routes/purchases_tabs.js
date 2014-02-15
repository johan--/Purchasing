
module('Unit - Routes - Purchases Tabs', {
  setup: function() {
    // Build fixtures
    fixtures.injectFixtures();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {

  }
});
