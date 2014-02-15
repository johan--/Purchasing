
module('Unit - Controllers - Purchases', {
  setup: function() {
    // Build fixtures
    fixtures.injectFixtures();
    myMocks.clearMocks();

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

  var testController = lookups.controller('purchases'),
      tabsController = testController.purchases;

  equal(testController.get('metadata.tab'), tabsController.get('metadata.tab'), 'Initially they mirror');

  tabsController.set('metadata.tab', 'ANewTabThatDoesntExist');
  equal(testController.get('metadata.tab'), 'ANewTabThatDoesntExist', 'After updating tabsController, they still mirror');
});


test('CanTabs are boolean based on metadata', function(){
  expect(2);

  var testController = lookups.controller('purchases'),
      tabsController = testController.purchases;

  //tabsController.set('metadata.tab', 'New');
  //equal(testController.get('canTabNew'), true, 'Can tab new');

  tabsController.set('metadata.tab', 'Purchased');
  equal(testController.get('canTabPurchased'), true, 'Can tab Purchased');

  tabsController.set('metadata.tab', 'Reconciled');
  equal(testController.get('canTabReconciled'), true, 'Can tab Reconciled');
});


test('Can change the page', function(){
  expect(1);

  var testController = lookups.controller('purchases');
  myMocks.addMockToRoute('purchases.tabs', true);

  Ember.run(function(){
    testController.send('page', 5);
  });

  andThen(function(){
    equal(myMocks.params.queryParams['purPage'], 5, 'The page was changed');
  });
});


/*
test('Can send a New tab param', function(){
  expect(2);
  myMocks.addMockToController('purchases');

  click(buttons.tabNew);

  andThen(function(){
    equal(myMocks.params.queryParams['tab'], 'New', 'Tab is New');
    equal(myMocks.params.queryParams['purPage'], 1, 'purPage is 1');
  });
});


test('Can send a Pending tab param', function(){
  expect(2);
  myMocks.addMockToController('purchases');


  click(buttons.tabNew);
  click(buttons.tabPending);

  andThen(function(){
    equal(myMocks.params.queryParams['tab'], 'Pending', 'Tab is Pending');
    equal(myMocks.params.queryParams['purPage'], 1, 'purPage is 1');
  });
});
*/


test('Can send a Purchased tab param', function(){
  expect(2);
  myMocks.addMockToController('purchases');


  click(buttons.tabPurchased);

  andThen(function(){
    equal(myMocks.params.queryParams['tab'], 'Purchased', 'Tab is Purchased');
    equal(myMocks.params.queryParams['purPage'], 1, 'purPage is 1');
  });
});


test('Can send a Reconciled tab param', function(){
  expect(2);
  myMocks.addMockToController('purchases');


  click(buttons.tabReconciled);

  andThen(function(){
    equal(myMocks.params.queryParams['tab'], 'Reconciled', 'Tab is Reconciled');
    equal(myMocks.params.queryParams['purPage'], 1, 'purPage is 1');
  });
});


test('Can send a Canceled tab param', function(){
  expect(2);
  myMocks.addMockToController('purchases');


  click(buttons.tabCanceled);

  andThen(function(){
    equal(myMocks.params.queryParams['tab'], 'Canceled', 'Tab is Canceled');
    equal(myMocks.params.queryParams['purPage'], 1, 'purPage is 1');
  });
});


test('Can send a Starred tab param', function(){
  expect(2);
  myMocks.addMockToController('purchases');


  click(buttons.tabStarred);

  andThen(function(){
    equal(myMocks.params.queryParams['tab'], 'Starred', 'Tab is Starred');
    equal(myMocks.params.queryParams['purPage'], 1, 'purPage is 1');
  });
});


test('Will toggle the sort order to DESC', function(){
  expect(2);
  var testController = lookups.controller('purchases');

  myMocks.addMockToController('purchases');

  Ember.run(function(){
    testController.set('metadata', { sort: 'dateRequested', direction: 'ASC' });
    testController.send('sortClick', 'dateRequested');
  });

  equal(myMocks.params.queryParams['sort'], 'dateRequested', 'Sort is dateRequested');
  equal(myMocks.params.queryParams['direction'], 'DESC', 'Direction is DESC');
});


test('Will toggle the sort order to ASC', function(){
  expect(2);
  var testController = lookups.controller('purchases');
  myMocks.addMockToController('purchases');

  Ember.run(function(){
    testController.set('metadata', { sort: 'dateRequested', direction: 'DESC' });
    testController.send('sortClick', 'dateRequested');
  });

  equal(myMocks.params.queryParams['sort'], 'dateRequested', 'Sort is dateRequested');
  equal(myMocks.params.queryParams['direction'], 'ASC', 'Direction is ASC');
});


test('Will default ASC for non-dateRequested sort fields', function(){
  expect(2);
  var testController = lookups.controller('purchases');

  myMocks.addMockToController('purchases');

  Ember.run(function(){
    testController.set('metadata', { sort: 'vendor.name', direction: 'ASC' });
    testController.send('sortClick', 'requester.name');
  });

  equal(myMocks.params.queryParams['sort'], 'requester.name', 'Sort is requester.name');
  equal(myMocks.params.queryParams['direction'], 'ASC', 'Direction is ASC');
});


test('Will default DESC for dateRequested sort fields', function(){
  expect(2);
  var testController = lookups.controller('purchases');

  myMocks.addMockToController('purchases');

  Ember.run(function(){
    testController.set('metadata', { sort: 'vendor.name', direction: 'ASC' });
    testController.send('sortClick', 'dateRequested');
  });

  equal(myMocks.params.queryParams['sort'], 'dateRequested', 'Sort is dateRequested');
  equal(myMocks.params.queryParams['direction'], 'DESC', 'Direction is DESC');
});
