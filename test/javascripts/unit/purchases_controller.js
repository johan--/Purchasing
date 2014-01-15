
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
  }
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
