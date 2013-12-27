
module('Purchase Edit', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadataFor('purchase');

    // Clear fixtures
    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: null,
                                       dateReconciled: null,
                                       dateCancelled: null });
  },

  teardown: function() {
    mockResults.clearMockResults();
  }

});

test('Route name is purchase.edit', function() {
  visit('/purchases/1').then(function(){

    equal(path(), 'purchase.edit', 'PAth is set to purchase.edit');

  });
});


