
module('Purchases-Tabs', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();

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
    mockResults.clearMockResults();
  }
});

// New Tab
test('= New Tab', function(){
  visit('/purchases').then(function(){

    updateTestFixtures(App.Purchase, { buyer: { id: 15, name: 'A test buyer' } });
    return click(buttons.tabNew);

  }).then(function(){

    equal(metadata.tab, 'New', 'Click New tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking New tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: null,
                                       dateReconciled: null,
                                       dateCancelled: null });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases/tabs?tab=New');

  }).then(function(){

    equal(find(buttons.purchaseRow).length, 5, 'Clicking New tab when there is data should show 5 records');

  });
});


// Pending Tab
test('- Pending Tab', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabPending);

  }).then(function(){

    equal(metadata.tab, 'Pending', 'Click Pending tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Pending tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCancelled: null });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases/tabs?tab=Pending');

  }).then(function(){

    equal(find(buttons.purchaseRow).length, 5, 'Clicking Pending tab when there is data should show 5 records');

  });
});


// Purchased Tab
test('- Purchased Tab', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabPurchased);

  }).then(function(){

    equal(metadata.tab, 'Purchased', 'Click Purchased tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Purchased tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCancelled: null });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases/tabs?tab=Purchased');

  }).then(function(){

    equal(find(buttons.purchaseRow).length, 5, 'Clicking Purchased tab when there is data should show 5 records');

  });
});


// Reconciled Tab
test('- Reconciled Tab', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabReconciled);

  }).then(function(){

    equal(metadata.tab, 'Reconciled', 'Click Reconciled tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Reconciled tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(APP_DATE_STRING),
                                       dateCancelled: null });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases/tabs?tab=Reconciled');

  }).then(function(){

    equal(find(buttons.purchaseRow).length, 5, 'Clicking Reconciled tab when there is data should show 5 records');

  });
});


// Cancelled Tab
test('- Cancelled Tab', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabCancelled);

  }).then(function(){
    equal(metadata.tab, 'Cancelled', 'Click Cancelled tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Cancelled tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(APP_DATE_STRING),
                                       dateCancelled: moment().format(APP_DATE_STRING) });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases/tabs?tab=Cancelled');

  }).then(function(){
    equal(find(buttons.purchaseRow).length, 5, 'Clicking Cancelled tab when there is data should show 5 records');
  });
});


// Starred Tab
test('- Starred Tab', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabStarred);

  }).then(function(){
    equal(metadata.tab, 'Starred', 'Click Starred tab should set metadata');
    equal(find(buttons.purchaseRow).length, 1, 'Clicking Starred tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(APP_DATE_STRING),
                                       starred: moment().format(APP_DATE_STRING) });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases/tabs?tab=Starred');

  }).then(function(){
    equal(find(buttons.purchaseRow).length, 5, 'Clicking Starred tab when there is data should show 5 records');
  });
});

