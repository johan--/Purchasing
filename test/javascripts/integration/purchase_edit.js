
module('Purchase Edit', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadata('purchase');
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});
