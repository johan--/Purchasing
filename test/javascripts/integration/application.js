
module('Application', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    metadata = getMetadataFor('purchase');
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});

test('Root redirects to purchases', function(){
  expect(1);
  visit('/').then(function () {
    equal(path(), 'purchases.tabs', 'Root redirects to /purchases');
  });
});
