// https://github.com/emberjs/ember.js/blob/master/packages/ember/tests/routing/basic_test.js

module('PurchasesTabsRoute', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});


//TODO: Is there a way to get the route to initialize without visiting '/'?

// queryParams

test('Can change the page', function(){
  visit('/').then(function(){
    mockResults.setupMockRoute('purchases.tabs');
    testRoute.send('page', 5);

    equal(mockResults.params.queryParams.purPage, 5, 'The page was changed');
  });
});

test('Can send a new tab param', function(){
  visit('/').then(function(){
    mockResults.setupMockRoute('purchases.tabs');

    testRoute.send('newPage', { tab: 'New' });
    equal(mockResults.params.queryParams.tab, 'New');
  });
});

test('tabClick sends a new tab param', function(){
  visit('/').then(function(){
    mockResults.setupMockRoute('purchases.tabs');

    testRoute.send('tabClick', 'New');
    equal(mockResults.params.queryParams.tab, 'New');
    equal(mockResults.params.queryParams.purPage, 1);

    testRoute.send('tabClick', 'Pending');
    equal(mockResults.params.queryParams.tab, 'Pending');
    equal(mockResults.params.queryParams.purPage, 1);

    testRoute.send('tabClick', 'Purchased');
    equal(mockResults.params.queryParams.tab, 'Purchased');
    equal(mockResults.params.queryParams.purPage, 1);

    testRoute.send('tabClick', 'Reconciled');
    equal(mockResults.params.queryParams.tab, 'Reconciled');
    equal(mockResults.params.queryParams.purPage, 1);

    testRoute.send('tabClick', 'Cancelled');
    equal(mockResults.params.queryParams.tab, 'Cancelled');
    equal(mockResults.params.queryParams.purPage, 1);

    testRoute.send('tabClick', 'Starred');
    equal(mockResults.params.queryParams.tab, 'Starred');
    equal(mockResults.params.queryParams.purPage, 1);
  });
});

test('Can reload the page', function(){
  visit('/').then(function(){
    mockResults.setupMockRoute('purchases.tabs');

    testRoute.send('reloadPage');
    equal(mockResults.params.queryParams.mode, 1, 'First click sets mode to 1');

    return wait();
  }).then(function(){
    testRoute.send('reloadPage');
    equal(mockResults.params.queryParams.mode, 0, 'First click sets mode to 0');
  });
});

test('Will toggle the sort order', function(){
  visit('/').then(function(){
    mockResults.setupMockRoute('purchases.tabs');

    testRoute.get('controller').set('metadata', { sort: 'dateRequested', direction: 'ASC' });
    testRoute.send('sortClick', 'dateRequested');

    equal(mockResults.params.queryParams.sort, 'dateRequested');
    equal(mockResults.params.queryParams.direction, 'DESC');

    testRoute.get('controller').set('metadata', { sort: 'dateRequested', direction: 'DESC' });
    testRoute.send('sortClick', 'dateRequested');

    equal(mockResults.params.queryParams.sort, 'dateRequested');
    equal(mockResults.params.queryParams.direction, 'ASC');
  });
});

test('Will default ASC for non-dateRequested sort fields', function(){
  visit('/').then(function(){
    mockResults.setupMockRoute('purchases.tabs');

    testRoute.get('controller').set('metadata', { sort: 'vendor.name', direction: 'ASC' });
    testRoute.send('sortClick', 'requester.name');

    equal(mockResults.params.queryParams.sort, 'requester.name');
    equal(mockResults.params.queryParams.direction, 'ASC');
  });
});

test('Will default DESC for dateRequested sort fields', function(){
  visit('/').then(function(){
    mockResults.setupMockRoute('purchases.tabs');

    testRoute.get('controller').set('metadata', { sort: 'vendor.name', direction: 'ASC' });
    testRoute.send('sortClick', 'dateRequested');

    equal(mockResults.params.queryParams.sort, 'dateRequested');
    equal(mockResults.params.queryParams.direction, 'DESC');
  });
});

test('getParams will set based on the correct order', function(){
  visit('/').then(function(){
    mockResults.setupMockRoute('purchases.tabs');

    var metadata = testRoute.currentModel.meta;

    // First from passed param
    equal(testRoute.getParams({ tab: 'Purchased' }).queryParams.tab, 'Purchased', 'Passed param has priority');

    // Second from metadata
    metadata.tab = 'New';
    equal(testRoute.getParams().queryParams.tab, 'New', 'Metadata has second priority');

    // Finally from internal defaults
    testRoute.currentModel.meta = null;
    equal(testRoute.getParams().queryParams.purPage, 1, 'Internal default for page');
    equal(testRoute.getParams().queryParams.sort, 'dateRequested', 'Internal default for sort');
    equal(testRoute.getParams().queryParams.direction, 'DESC', 'Internal default for direction');
    equal(testRoute.getParams().queryParams.tab, 'Pending', 'Internal default for tab');

  });
});
