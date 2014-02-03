
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
  expect(2);

  var testController = helperMethods.controller('purchases'),
      tabsController = testController.purchases;

  equal(testController.get('metadata.tab'), tabsController.get('metadata.tab'), 'Initially they mirror');

  tabsController.set('metadata.tab', 'ANewTabThatDoesntExist');
  equal(testController.get('metadata.tab'), 'ANewTabThatDoesntExist', 'After updating tabsController, they still mirror');
});


test('CanTabs are boolean based on metadata', function(){
  expect(3);

  var testController = helperMethods.controller('purchases'),
      tabsController = testController.purchases;

  tabsController.set('metadata.tab', 'New');
  equal(testController.get('canTabNew'), true, 'Can tab new');

  tabsController.set('metadata.tab', 'Purchased');
  equal(testController.get('canTabPurchased'), true, 'Can tab Purchased');

  tabsController.set('metadata.tab', 'Reconciled');
  equal(testController.get('canTabReconciled'), true, 'Can tab Reconciled');
});


test('Can change the page', function(){
  expect(1);

  var testController = helperMethods.controller('purchases');
  mockResults.addMockToRoute('purchases.tabs', true);

  Ember.run(function(){
    testController.send('page', 5);
  });

  andThen(function(){
    equal(mockResults.params.queryParams['purPage'], 5, 'The page was changed');
  });
});


test('Can send a New tab param', function(){
  expect(2);
  mockResults.addMockToController('purchases.tabs');

  click(buttons.tabNew);

  andThen(function(){
    equal(mockResults.params.queryParams['tab'], 'New');
    equal(mockResults.params.queryParams['purPage'], 1);
  });
});


test('Can send a Pending tab param', function(){
  expect(2);
  mockResults.addMockToController('purchases.tabs');


  click(buttons.tabNew);
  click(buttons.tabPending);

  andThen(function(){
    equal(mockResults.params.queryParams['tab'], 'Pending');
    equal(mockResults.params.queryParams['purPage'], 1);
  });
});


test('Can send a Purchased tab param', function(){
  expect(2);
  mockResults.addMockToController('purchases.tabs');


  click(buttons.tabPurchased);

  andThen(function(){
    equal(mockResults.params.queryParams['tab'], 'Purchased');
    equal(mockResults.params.queryParams['purPage'], 1);
  });
});


test('Can send a Reconciled tab param', function(){
  expect(2);
  mockResults.addMockToController('purchases.tabs');


  click(buttons.tabReconciled);

  andThen(function(){
    equal(mockResults.params.queryParams['tab'], 'Reconciled');
    equal(mockResults.params.queryParams['purPage'], 1);
  });
});


test('Can send a Cancelled tab param', function(){
  expect(2);
  mockResults.addMockToController('purchases.tabs');


  click(buttons.tabCancelled);

  andThen(function(){
    equal(mockResults.params.queryParams['tab'], 'Cancelled');
    equal(mockResults.params.queryParams['purPage'], 1);
  });
});


test('Can send a Starred tab param', function(){
  expect(2);
  mockResults.addMockToController('purchases.tabs');


  click(buttons.tabStarred);

  andThen(function(){
    equal(mockResults.params.queryParams['tab'], 'Starred');
    equal(mockResults.params.queryParams['purPage'], 1);
  });
});


test('Will toggle the sort order to DESC', function(){
  expect(2);
  var testController = helperMethods.controller('purchases');

  mockResults.addMockToController('purchases');

  Ember.run(function(){
    testController.set('metadata', { sort: 'dateRequested', direction: 'ASC' });
  });
  testController.send('sortClick', 'dateRequested');

  andThen(function(){
    equal(mockResults.params.queryParams['sort'], 'dateRequested');
    equal(mockResults.params.queryParams['direction'], 'DESC');
  });
});


test('Will toggle the sort order to ASC', function(){
  expect(2);
  var testController = helperMethods.controller('purchases');

  mockResults.addMockToController('purchases');

  Ember.run(function(){
    testController.set('metadata', { sort: 'dateRequested', direction: 'DESC' });
  });
  testController.send('sortClick', 'dateRequested');

  andThen(function(){
    equal(mockResults.params.queryParams['sort'], 'dateRequested');
    equal(mockResults.params.queryParams['direction'], 'ASC');
  });
});


test('Will default ASC for non-dateRequested sort fields', function(){
  expect(2);
  var testController = helperMethods.controller('purchases');

  mockResults.addMockToController('purchases');

  Ember.run(function(){
    testController.set('metadata', { sort: 'vendor.name', direction: 'ASC' });
  });
  testController.send('sortClick', 'requester.name');

  andThen(function(){
    equal(mockResults.params.queryParams['sort'], 'requester.name');
    equal(mockResults.params.queryParams['direction'], 'ASC');
  });
});


test('Will default DESC for dateRequested sort fields', function(){
  expect(2);
  var testController = helperMethods.controller('purchases');

  mockResults.addMockToController('purchases');

  Ember.run(function(){
    testController.set('metadata', { sort: 'vendor.name', direction: 'ASC' });
  });
  testController.send('sortClick', 'dateRequested');

  andThen(function(){
    equal(mockResults.params.queryParams['sort'], 'dateRequested');
    equal(mockResults.params.queryParams['direction'], 'DESC');
  });
});
