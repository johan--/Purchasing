
module('PurchasesController', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/');
  },

  teardown: function() {
    visit('/');
  }
});


test('Metadata observes purchases.tabs controller', function(){
  visit('/').then(function(){
    var testController = helperMethods.controller('purchases'),
        tabsController = testController.purchases;

    equal(testController.get('metadata.tab'), tabsController.get('metadata.tab'), 'Initially they mirror');

    tabsController.set('metadata.tab', 'ANewTabThatDoesntExist');
    equal(testController.get('metadata.tab'), 'ANewTabThatDoesntExist', 'After updating tabsController, they still mirror');
  });
});

test('CanTabs are boolean based on metadata', function(){
  visit('/').then(function(){
    // TODO: Why are the computed properties always returning false?  Otherwise this test is kind of pointless
    // Still going to use the observer just to make sure it works under use
    var testController = helperMethods.controller('purchases'),
        tabsController = testController.purchases;

    tabsController.set('metadata.tab', 'New');
    equal(testController.canTab('New'), true, 'Can tab new');

    tabsController.set('metadata.tab', 'Pending');
    equal(testController.canTab('Pending'), true, 'Can tab Pending');

    tabsController.set('metadata.tab', 'Purchased');
    equal(testController.canTab('Purchased'), true, 'Can tab Purchased');

    tabsController.set('metadata.tab', 'Reconciled');
    equal(testController.canTab('Reconciled'), true, 'Can tab Reconciled');

    tabsController.set('metadata.tab', 'Cancelled');
    equal(testController.canTab('Cancelled'), true, 'Can tab Cancelled');

    tabsController.set('metadata.tab', 'Starred');
    equal(testController.canTab('Starred'), true, 'Can tab Starred');

  });
});


test('Can change the page', function(){
  var testController = helperMethods.controller('purchases');
  mockResults.addMockToController('purchases.tabs');

  testController.send('page', 5);

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[purPage]'], 5, 'The page was changed');
  });
});

test('tabClick sends a New tab param', function(){
  var testController = helperMethods.controller('purchases');
  mockResults.addMockToController('purchases.tabs');

  testController.send('tabClick', 'New');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'New');
    equal(mockResults.params.queryParams['purchases.tabs[purPage]'], 1);
  });
});

test('tabClick sends a Pending tab param', function(){
  var testController = helperMethods.controller('purchases');
  mockResults.addMockToController('purchases.tabs');

  testController.send('tabClick', 'Pending');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'Pending');
    equal(mockResults.params.queryParams['purchases.tabs[purPage]'], 1);
  });
});

test('tabClick sends a Purchased tab param', function(){
  var testController = helperMethods.controller('purchases');
  mockResults.addMockToController('purchases.tabs');

  testController.send('tabClick', 'Purchased');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'Purchased');
    equal(mockResults.params.queryParams['purchases.tabs[purPage]'], 1);
  });
});

test('tabClick sends a Reconciled tab param', function(){
  var testController = helperMethods.controller('purchases');
  mockResults.addMockToController('purchases.tabs');

  testController.send('tabClick', 'Reconciled');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'Reconciled');
    equal(mockResults.params.queryParams['purchases.tabs[purPage]'], 1);
  });
});

test('tabClick sends a Cancelled tab param', function(){
  var testController = helperMethods.controller('purchases');
  mockResults.addMockToController('purchases.tabs');

  testController.send('tabClick', 'Cancelled');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'Cancelled');
    equal(mockResults.params.queryParams['purchases.tabs[purPage]'], 1);
  });
});

test('tabClick sends a Starred tab param', function(){
  var testController = helperMethods.controller('purchases');
  mockResults.addMockToController('purchases.tabs');

  testController.send('tabClick', 'Starred');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[tab]'], 'Starred');
    equal(mockResults.params.queryParams['purchases.tabs[purPage]'], 1);
  });
});


test('Will toggle the sort order to DESC', function(){
  var testController = helperMethods.controller('purchases');

  mockResults.addMockToController('purchases.tabs');

  Ember.run(function(){
    testController.set('metadata', { sort: 'dateRequested', direction: 'ASC' });
  });
  testController.send('sortClick', 'dateRequested');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[sort]'], 'dateRequested');
    equal(mockResults.params.queryParams['purchases.tabs[direction]'], 'DESC');
  });
});

test('Will toggle the sort order to ASC', function(){
  var testController = helperMethods.controller('purchases');

  mockResults.addMockToController('purchases.tabs');

  Ember.run(function(){
    testController.set('metadata', { sort: 'dateRequested', direction: 'DESC' });
  });
  testController.send('sortClick', 'dateRequested');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[sort]'], 'dateRequested');
    equal(mockResults.params.queryParams['purchases.tabs[direction]'], 'ASC');
  });
});

test('Will default ASC for non-dateRequested sort fields', function(){
  var testController = helperMethods.controller('purchases');

  mockResults.addMockToController('purchases.tabs');

  Ember.run(function(){
    testController.set('metadata', { sort: 'vendor.name', direction: 'ASC' });
  });
  testController.send('sortClick', 'requester.name');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[sort]'], 'requester.name');
    equal(mockResults.params.queryParams['purchases.tabs[direction]'], 'ASC');
  });
});

test('Will default DESC for dateRequested sort fields', function(){
  var testController = helperMethods.controller('purchases');

  mockResults.addMockToController('purchases.tabs');

  Ember.run(function(){
    testController.set('metadata', { sort: 'vendor.name', direction: 'ASC' });
  });
  testController.send('sortClick', 'dateRequested');

  andThen(function(){
    equal(mockResults.params.queryParams['purchases.tabs[sort]'], 'dateRequested');
    equal(mockResults.params.queryParams['purchases.tabs[direction]'], 'DESC');
  });
});
