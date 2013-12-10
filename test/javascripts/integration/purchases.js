
module('Purchases', {
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

test('Purchases DOM elements', function(){
  visit('/purchases').then(function(){

    // Title and navigation
    ok(exists('.header_title'), 'Loads the header');
    ok(exists('.navigation_menu'), 'Loads the navigation button');
    ok(exists('.navigation_items'), 'Loads the navigation items');
    equal(find('.navigation_items li').length, 7, 'Loads 7 navigation items');

    ok(exists(buttons.searchBoxInput), 'Loads the search input');
    ok(exists(buttons.searchAdvancedIcon), 'Loads the advanced search icon');
    ok(exists(buttons.searchStart), 'Loads the search button');
    ok(exists(buttons.searchModal), 'Loads the advanced search modal');

    ok(exists(buttons.newButton), 'Loads the new button');
    ok(exists(buttons.reloadButton), 'Loads the reload button');

    // Tabs
    ok(exists(buttons.tabNew), 'Loads the New tab');
    ok(exists(buttons.tabPending), 'Loads the Pending tab');
    ok(exists(buttons.tabPurchased), 'Loads the Purchased tab');
    ok(exists(buttons.tabReconciled), 'Loads the Reconciled tab');
    ok(exists(buttons.tabCancelled), 'Loads the Cancelled tab');

    // Right controls (Default)
    ok(exists(buttons.filterButton), 'Loads the filter button');
    ok(exists(buttons.filterModal), 'Loads the filter modal');

    ok(exists(buttons.pageNext), 'Loads the next page button');
    ok(exists(buttons.pagePrevious), 'Loads the previous page button');
 });
});


// New Tab
test('Purchases tabs - New', function(){
  visit('/purchases').then(function(){

    updateTestFixtures(App.Purchase, { buyer: { id: 15, name: 'A test buyer' } });
    return click(buttons.tabNew);

  }).then(function(){
    equal(metadata.tab, 'New', 'Click New tab should set metadata');
    ok(exists(buttons.startAssigning), 'Click New tab should show the assigning button');
    equal(find('.purchase').length, 0, 'Clicking New tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: null,
                                       dateReconciled: null,
                                       dateCancelled: null });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases?tab=New');

  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking New tab when there is data should show 5 records');
  });
});


// Pending Tab
test('Purchases tabs - Pending', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabPending);

  }).then(function(){
    equal(metadata.tab, 'Pending', 'Click Pending tab should set metadata');
    equal(find('.purchase').length, 0, 'Clicking Pending tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCancelled: null });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases?tab=Pending');

  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking Pending tab when there is data should show 5 records');
  });
});


// Purchased Tab
test('Purchases tabs - Purchased', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabPurchased);

  }).then(function(){
    equal(metadata.tab, 'Purchased', 'Click Purchased tab should set metadata');
    ok(exists(buttons.startReconciling), 'Click Purchased tab should show the reconciling button');
    equal(find('.purchase').length, 0, 'Clicking Purchased tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCancelled: null });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases?tab=Purchased');

  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking Purchased tab when there is data should show 5 records');
  });
});


// Reconciled Tab
test('Purchases tabs - Reconciled', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabReconciled);

  }).then(function(){
    equal(metadata.tab, 'Reconciled', 'Click Reconciled tab should set metadata');
    ok(exists(buttons.startUnReconciling), 'Click Reconciled tab should show the un-reconciling button');
    equal(find('.purchase').length, 0, 'Clicking Reconciled tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(APP_DATE_STRING),
                                       dateCancelled: null });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases?tab=Reconciled');

  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking Reconciled tab when there is data should show 5 records');
  });
});


// Cancelled Tab
test('Purchases tabs - Cancelled', function(){
  visit('/purchases').then(function(){

    return click(buttons.tabCancelled);

  }).then(function(){
    equal(metadata.tab, 'Cancelled', 'Click Cancelled tab should set metadata');
    equal(find('.purchase').length, 0, 'Clicking Cancelled tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(APP_DATE_STRING),
                                       dateCancelled: moment().format(APP_DATE_STRING) });
    // Use visit() for second click since click() won't refresh the tab
    return visit('/purchases?tab=Cancelled');

  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking Cancelled tab when there is data should show 5 records');
  });
});


test('-Purchases field sorters', function(){
  visit('/purchases').then(function(){


  // Buyer Cell
    return click(buttons.buyerHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'buyer.name', 'Click buyer should sort by buyer');
    equal(metadata.direction, 'ASC', 'Click buyer first time should sort ASC');

    return click(buttons.buyerHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click buyer second time should sort DESC');


  // Date Cell
    return click(buttons.dateHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'dateRequested', 'Click date should sort by date');
    equal(metadata.direction, 'ASC', 'Click date first time should sort ASC');

    return click(buttons.dateHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click date second time should sort DESC');


  // Vendor Cell
    return click(buttons.vendorHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'vendorString', 'Click vendor should sort by vendor');
    equal(metadata.direction, 'ASC', 'Click vendor first time should sort ASC');

    return click(buttons.vendorHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click vendor second time should sort DESC');


  // Requester Cell
    return click(buttons.requesterHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'requester.name', 'Click requester should sort by requester');
    equal(metadata.direction, 'ASC', 'Click requester first time should sort ASC');

    return click(buttons.requesterHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click requester second time should sort DESC');


  // Department Cell
    return click(buttons.departmentHeaderCell);
  }).then(function(){
    equal(metadata.sort, 'requester.department', 'Click department should sort by department');
    equal(metadata.direction, 'ASC', 'Click department first time should sort ASC');

    return click(buttons.departmentHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click department second time should sort DESC');

  });
});


test('-Can click a record to open', function(){

  visit('/purchases?tab=New').then(function(){

    return click(buttons.firstRow);

  }).then(function(){
    equal(path(), 'edit', 'Opening a record transitions to edit');

  });
});


test('-Can assign records', function(){

  visit('/purchases?tab=New').then(function(){
    return click(buttons.startAssigning);

  }).then(function(){
    // Button should now be down
    ok(exists(buttons.startAssigning_down), 'Assigning button should be "down"');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Select all button should be visible');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Select none button should be visible');
    // Includes cancel button
    ok(exists(buttons.actionCancel), 'Cancel button should be visible');

    // click a record
    return click(find('.bar')[1]);

  }).then(function(){
    // green button should be showing
    ok(exists(buttons.actionComplete), 'Clicking a record in assigning mode should show assign button');
    equal(find(buttons.actionCompleteTotal).text(), '1', 'Clicking a record should show a total of 1');

    return click(find('.bar')[0]);

  }).then(function(){
    equal(find(buttons.actionCompleteTotal).text(), '2', 'Clicking another record should show a total of 2');

    return click(find('.bar')[1]);

  }).then(function(){
    equal(find(buttons.actionCompleteTotal).text(), '1', 'Clicking original record a second time should show a total of 1');

    return click(buttons.actionComplete);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/assign', 'Assigning calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'Assigning send an array of IDs');
  });
});

test('-Can reconcile records', function(){

  updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                     buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?tab=Purchased').then(function(){
    return click(buttons.startReconciling);

  }).then(function(){
    // Button should now be down
    ok(exists(buttons.startReconciling_down), 'Reconciling button should be "down"');

    // click a record
    return click(find('.bar')[1]);

  }).then(function(){
    // green button should be showing
    ok(exists(buttons.actionComplete), 'Clicking a record in assigning mode should show assign button');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Select all button should be visible');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Select none button should be visible');
    // Includes cancel button
    ok(exists(buttons.actionCancel), 'Cancel button should be visible');

    equal(find(buttons.actionCompleteTotal).text(), '1', 'Clicking a record should show a total of 1');

    return click(find('.bar')[0]);

  }).then(function(){
    equal(find(buttons.actionCompleteTotal).text(), '2', 'Clicking another record should show a total of 2');

    return click(find('.bar')[1]);

  }).then(function(){
    equal(find(buttons.actionCompleteTotal).text(), '1', 'Clicking original record a second time should show a total of 1');

    return click(buttons.actionComplete);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/reconcile', 'Assigning calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'Assigning send an array of IDs');
    equal(mockResults.ajaxParams.data.value, true, 'Assigning sends assign value of true');
  });
});


test('-Can unreconcile records', function(){

  updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                     dateReconciled: moment().format(APP_DATE_STRING),
                                     buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?tab=Reconciled').then(function(){
    return click(buttons.startUnReconciling);

  }).then(function(){
    // Button should now be down
    ok(exists(buttons.startUnReconciling_down), 'Un-Reconciling button should be "down"');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Select all button should be visible');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Select none button should be visible');
    // Includes cancel button
    ok(exists(buttons.actionCancel), 'Cancel button should be visible');

    // click a record
    return click(find('.bar')[1]);

  }).then(function(){
    // green button should be showing
    ok(exists(buttons.actionComplete), 'Clicking a record in assigning mode should show assign button');
    equal(find(buttons.actionCompleteTotal).text(), '1', 'Clicking a record should show a total of 1');

    return click(find('.bar')[0]);

  }).then(function(){
    equal(find(buttons.actionCompleteTotal).text(), '2', 'Clicking another record should show a total of 2');

    return click(find('.bar')[1]);

  }).then(function(){
    equal(find(buttons.actionCompleteTotal).text(), '1', 'Clicking original record a second time should show a total of 1');

    return click(buttons.actionComplete);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/reconcile', 'Assigning calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'Assigning send an array of IDs');
    equal(mockResults.ajaxParams.data.value, false, 'Assigning sends assign value of false');
  });
});


test('-Action buttons', function(){
  visit('/purchases?tab=New').then(function(){
    return click(buttons.startAssigning);

  }).then(function(){
    return click(buttons.actionCheckAll);

  }).then(function(){
    equal(find(buttons.actionCompleteTotal).text(), '5', 'Select all should result in 5 records selected');

    return click(buttons.actionCheckNone);

  }).then(function(){
    equal(find(buttons.actionComplete).length, 0, 'Select none should result in removing complete button');
    // test for 0 selected?

    return click(buttons.actionCancel);
  }).then(function(){
    equal(find(buttons.startAssigning_down).length, 0, 'Cancel button should cancel');

  });
});


test('-Star', function(){
  visit('/purchases?tab=New').then(function(){

    return click(buttons.firstRowStar);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/1/toggle_starred', 'Starring calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');

  });
});


test('-Delete', function(){
  visit('/purchases?tab=New').then(function(){

    return click(buttons.firstRowDelete);
  }).then(function(){

    ok(mockResults.alertMessage.indexOf('This will permanentaly delete this record') > -1, 'Clicking delete displays confirmation');
    equal(find('.purchase').length, 4, 'After deleting there should be 4 records');

    var purchases = helperMethods.store().all(App.Purchase).filter(function(rec){
      if (rec.id == 1) return true;
    });

    equal(purchases.length, 0, 'Deleted record should be removed from fixtures');

  });
});


test('-New Record', function(){

  visit('/purchases?tab=New').then(function(){

    return click(buttons.newButton);

  }).then(function(){
    equal(path(), 'new', 'Opening a record transitions to new');

  });
});


test('-Refresh', function(){
  var current_params;

  visit('/purchases?tab=New').then(function(){
    current_params = getQueryParamsFor('purchases');

    return click(buttons.reloadButton);

  }).then(function(){
    var new_params = getQueryParamsFor('purchases');
    notEqual(current_params.mode, new_params.mode, 'Clicking refresh toggles the "mode" queryParam');

  });
});
