
var testController = null;

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
  }
});


test('Can send a new tab param', function(){
  var testController = helperMethods.controller('purchases.tabs');
  mockResults.addMockToController('purchases.tabs');

  testController.send('newPage', { tab: 'New' });

  equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'New');
});

test('Will toggle the sort order', function(){
  var testController = helperMethods.controller('purchases.tabs');
  mockResults.addMockToController('purchases.tabs');

  testController.set('metadata', { sort: 'dateRequested', direction: 'ASC' });
  testController.send('sortClick', 'dateRequested');

  equal(mockResults.params.queryParams.sort, 'dateRequested');
  equal(mockResults.params.queryParams.direction, 'DESC');

  testController.set('metadata', { sort: 'dateRequested', direction: 'DESC' });
  testController.send('sortClick', 'dateRequested');

  equal(mockResults.params.queryParams.sort, 'dateRequested');
  equal(mockResults.params.queryParams.direction, 'ASC');
});

test('Will default ASC for non-dateRequested sort fields', function(){
  var testController = helperMethods.controller('purchases.tabs');
  mockResults.addMockToController('purchases.tabs');

  testController.set('metadata', { sort: 'vendor.name', direction: 'ASC' });
  testController.send('sortClick', 'requester.name');

  equal(mockResults.params.queryParams.sort, 'requester.name');
  equal(mockResults.params.queryParams.direction, 'ASC');
});

test('Will default DESC for dateRequested sort fields', function(){
  var testController = helperMethods.controller('purchases.tabs');
  mockResults.addMockToController('purchases');

  testController.set('metadata', { sort: 'vendor.name', direction: 'ASC' });
  testController.send('sortClick', 'dateRequested');

  equal(mockResults.params.queryParams.sort, 'dateRequested');
  equal(mockResults.params.queryParams.direction, 'DESC');
});

test('getParams on controller will set based on the correct order', function(){
  var testController = helperMethods.controller('purchases.tabs');
  mockResults.addMockToController('purchases.tabs');

  var metadata = testRoute.currentModel.meta;

  // First from passed param
  equal(testController.getParams({ tab: 'Purchased' }).queryParams.tab, 'Purchased', 'Passed param has priority');

  // Second from metadata
  metadata.tab = 'New';
  equal(testController.getParams().queryParams.tab, 'New', 'Metadata has second priority');

  // Finally from internal defaults
  testController.get('model').set('meta', null);
  equal(testController.getParams().queryParams.purPage, 1, 'Internal default for page');
  equal(testController.getParams().queryParams.sort, 'dateRequested', 'Internal default for sort');
  equal(testController.getParams().queryParams.direction, 'DESC', 'Internal default for direction');
  equal(testController.getParams().queryParams.tab, 'Pending', 'Internal default for tab');
});
