
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
  var testController = helperMethods.controller('purchases.tabs');
  mockResults.addMockToController('purchases.tabs');

  testController.send('newPage', { tab: 'New' });

  equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'New');
});


test('getParams on controller will set based on the correct order', function(){
  var testController = helperMethods.controller('purchases.tabs'),
      testRoute = helperMethods.route('purchases.tabs');
  mockResults.addMockToController('purchases.tabs');

  // First from passed param
  equal(testController.getParams({ tab: 'Purchased' }).queryParams.tab, 'Purchased', 'Passed param has priority');

  // Second from metadata
  Ember.run(function(){
    testController.set('metadata.tab', 'New');
  });

  equal(testController.getParams().queryParams.tab, 'New', 'Metadata has second priority');


  // Finally from internal defaults
  Ember.run(function(){
    testController.set('metadata', { purPage: null, sort: null, direction: null, tab: null });
  });

  equal(testController.getParams().queryParams.purPage, 1, 'Internal default for page');
  equal(testController.getParams().queryParams.sort, 'dateRequested', 'Internal default for sort');
  equal(testController.getParams().queryParams.direction, 'DESC', 'Internal default for direction');
  equal(testController.getParams().queryParams.tab, 'Pending', 'Internal default for tab');
});
