
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


test('Can send a new tab param', function(){
  expect(1);

  var testController = helperMethods.controller('purchases');
  mockResults.addMockToRoute('purchases.tabs');

  Ember.run(function(){
    testController.newPage({ tab: 'New' });
  });

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'New');
  });
});
