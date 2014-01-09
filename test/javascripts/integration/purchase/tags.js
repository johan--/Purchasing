
module('Tags', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

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
  }

});

test('Tag select is showing', function(){
  visit('/purchases/1/edit').then(function(){

    andThen(function(){
      equal(isVisible(buttons.tagsSelect), true, 'Tag select should be visible');
    });
  });
});
