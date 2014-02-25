
module('Integration - Purchases - Tabs', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/');
  },

  teardown: function() {

  }
});

/*
// New Tab
test('New Tab', function() {
  expect(3);
  var metadata = lookups.metadata('purchase');

  fixtures.updateAllFixtures(App.Purchase, { buyer: { id: 15, name: 'A test buyer' } });

  click(buttons.tabNew).then(function() {

    equal(metadata.tab, 'New', 'Click New tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking New tab when there is no data should show 0 records');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: null,
                                       buyer: null,
                                       dateReconciled: null,
                                       dateCanceled: null });

    return visit('/purchases/tabs?tab=Purchased');

  }).then(function() {
    equal(find(buttons.purchaseRow).length, 5, 'Clicking New tab when there is data should show 5 records');
  });
});


// Pending Tab
test('Pending Tab', function() {
  expect(3);
  var metadata = lookups.metadata('purchase');

  click(buttons.tabPending).then(function() {

    equal(metadata.tab, 'Pending', 'Click Pending tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Pending tab when there is no data should show 0 records');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: null,
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCanceled: null });

    return visit('/purchases/tabs?tab=Pending');

  }).then(function() {
    equal(find(buttons.purchaseRow).length, 5, 'Clicking Pending tab when there is data should show 5 records');
  });
});


// Reconciled Tab
test('Reconciled Tab', function() {
  expect(3);
  var metadata = lookups.metadata('purchase');

  click(buttons.tabReconciled).then(function() {

    equal(metadata.tab, 'Reconciled', 'Click Reconciled tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Reconciled tab when there is no data should show 0 records');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(App.Globals.DATE_STRING),
                                       dateCanceled: null });

    return visit('/purchases/tabs?tab=Reconciled');

  }).then(function() {
    equal(find(buttons.purchaseRow).length, 5, 'Clicking Reconciled tab when there is data should show 5 records');
  });
});
*/


// Purchased Tab
test('Purchased Tab', function() {
  expect(3);
  var controller = lookups.controller('purchases.tabs');

  fixtures.updateAllFixtures(App.Purchase, { dateCanceled: moment().format(App.Globals.DATE_STRING) });

  click(buttons.tabPurchased).then(function() {

    equal(controller.tab, 'Purchased', 'Click Purchased tab should set queryParam');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Purchased tab when there is no data should show 0 records');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCanceled: null });

    return visit('/purchases/tabs?tab=Purchased');

  }).then(function() {
    equal(find(buttons.purchaseRow).length, 5, 'Clicking Purchased tab when there is data should show 5 records');
  });
});


test('Received Tab', function() {
  expect(3);
  var controller = lookups.controller('purchases.tabs');

  fixtures.updateAllFixtures(App.Purchase, { dateCanceled: moment().format(App.Globals.DATE_STRING) });

  click(buttons.tabReceived).then(function() {

    equal(controller.tab, 'Received', 'Click Received tab should set queryParam');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Received tab when there is no data should show 0 records');

    fixtures.updateAllFixtures(App.Purchase, { dateCanceled: null,
                                               received_server: true });

    return visit('/purchases/tabs?tab=Received');

  }).then(function() {
    equal(find(buttons.purchaseRow).length, 5, 'Clicking Received tab when there is data should show 5 records');
  });
});



// Canceled Tab
test('Canceled Tab', function() {
  expect(3);
  var controller = lookups.controller('purchases.tabs');

  click(buttons.tabCanceled).then(function() {

    equal(controller.tab, 'Canceled', 'Click Canceled tab should set queryParam');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Canceled tab when there is no data should show 0 records');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(App.Globals.DATE_STRING),
                                       dateCanceled: moment().format(App.Globals.DATE_STRING) });

    return visit('/purchases/tabs?tab=Canceled');

  }).then(function() {
    equal(find(buttons.purchaseRow).length, 5, 'Clicking Canceled tab when there is data should show 5 records');
  });
});


// Starred Tab
test('Starred Tab', function() {
  expect(3);
  var controller = lookups.controller('purchases.tabs');

  click(buttons.tabStarred).then(function() {

    equal(controller.tab, 'Starred', 'Click Starred tab should set queryParam');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Starred tab when there is no data should show 0 records');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(App.Globals.DATE_STRING),
                                       starred: moment().format(App.Globals.DATE_STRING) });

    return visit('/?tab=Starred');

  }).then(function() {
    equal(find(buttons.purchaseRow).length, 5, 'Clicking Starred tab when there is data should show 5 records');
  });
});
