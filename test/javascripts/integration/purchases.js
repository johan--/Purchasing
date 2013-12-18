
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
    ok(exists('.navbar'), 'Loads the header');
    ok(exists('.navbar-nav>.dropdown>a>i.fa-cog'), 'Loads the navigation button');
    ok(exists('.navbar-nav>.dropdown:has(a>i.fa-cog)>.dropdown-menu'), 'Loads the navigation items');
    equal(find('.navbar-nav>.dropdown:has(a>i.fa-cog)>.dropdown-menu li').length, 4, 'Loads 4 navigation items');

    ok(exists(buttons.searchBoxInput), 'Loads the search input');
    ok(exists(buttons.searchAdvancedIcon), 'Loads the advanced search icon');
    ok(exists(buttons.searchStart), 'Loads the search button');
    ok(exists(buttons.searchModal), 'Loads the advanced search modal');

    ok(exists(buttons.newButton), 'Loads the new button');

    // Tabs
    ok(exists(buttons.tabNew), 'Loads the New tab');
    ok(exists(buttons.tabPending), 'Loads the Pending tab');
    ok(exists(buttons.tabPurchased), 'Loads the Purchased tab');
    ok(exists(buttons.tabReconciled), 'Loads the Reconciled tab');
    ok(exists(buttons.tabCancelled), 'Loads the Cancelled tab');
    ok(exists(buttons.tabStarred), 'Loads the Cancelled tab');

    ok(exists(buttons.pageNext), 'Loads the next page button');
    ok(exists(buttons.pagePrevious), 'Loads the previous page button');
    ok(exists(buttons.pageFirst), 'Loads the first page button');
    ok(exists(buttons.pageLast), 'Loads the last page button');
 });
});


// New Tab
test('Purchases tabs - New', function(){
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
test('Purchases tabs - Pending', function(){
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
test('Purchases tabs - Purchased', function(){
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
test('Purchases tabs - Reconciled', function(){
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
test('Purchases tabs - Cancelled', function(){
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
test('Purchases tabs - Starred', function(){
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
    equal(metadata.direction, 'DESC', 'Click date first time should sort ASC');

    return click(buttons.dateHeaderCell);
  }).then(function(){
    equal(metadata.direction, 'ASC', 'Click date second time should sort DESC');


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


test('-Can click a record to edit', function(){

  visit('/purchases?tab=New').then(function(){

    return click(find(buttons.purchaseEdit)[0]);

  }).then(function(){
    equal(path(), 'purchase.edit', 'Opening a record transitions to edit');

  });
});


test('-Can click a record to show', function(){

  visit('/purchases?tab=New').then(function(){

    return click(find(buttons.purchaseShow)[0]);

  }).then(function(){
    equal(path(), 'purchase.edit', 'Opening a record transitions to show');  // TODO


  });
});


test('-Can assign records', function(){

  visit('/purchases?tab=New').then(function(){

    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    // Includes assign button
    ok(exists(buttons.actionAssignComplete), 'Clicking a record should show assign button');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Clicking a record should show select all button');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Clicking a record should show select none button');


  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '1', 'Clicking a record should show a total of 1');

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '2', 'Clicking another record should show a total of 2');

    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '1', 'Clicking original record a second time should show a total of 1');

    helperMethods.controller('purchases').set('assignBuyer', 5); // Fake

    return click(buttons.actionAssignComplete);

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

    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    // Includes reconcile button
    ok(exists(buttons.actionReconcileComplete), 'Clicking a record should show reconcile button');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Clicking a record should show select all button');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Clicking a record should show select none button');

    contains(find(buttons.actionReconcileComplete).text(), '1', 'Clicking a record should show a total of 1');

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    contains(find(buttons.actionReconcileComplete).text(), '2', 'Clicking another record should show a total of 2');

    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    contains(find(buttons.actionReconcileComplete).text(), '1', 'Clicking original record a second time should show a total of 1');

    return click(buttons.actionReconcileComplete);
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
    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){

    // Includes unreconcile button
    ok(exists(buttons.actionUnreconcileComplete), 'Clicking a record should show unreconciling button');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Clicking a record should show select all button');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Clicking a record should show select none button');

    contains(find(buttons.actionUnreconcileComplete).text(), '1', 'Clicking a record should show a total of 1');

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    contains(find(buttons.actionUnreconcileComplete).text(), '2', 'Clicking another record should show a total of 2');

    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    contains(find(buttons.actionUnreconcileComplete).text(), '1', 'Clicking original record a second time should show a total of 1');

    return click(buttons.actionUnreconcileComplete);

  }).then(function(){
    equal(mockResults.ajaxParams.url, '/purchases/reconcile', 'Assigning calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'Assigning send an array of IDs');
    equal(mockResults.ajaxParams.data.value, false, 'Assigning sends assign value of false');
  });
});


test('-Action buttons', function(){
  visit('/purchases?tab=New').then(function(){
    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    return click(buttons.actionCheckAll);

  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '5', 'Select all should result in 5 records selected');

    return click(buttons.actionCheckNone);

  }).then(function(){
    equal(find(buttons.actionAssignComplete).length, 0, 'Select none should result in removing complete button');
    // TODO test controller for 0 selected?

  });
});


test('-Star', function(){
  visit('/purchases?tab=New').then(function(){

    return click(buttons.firstRowStar);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/1/toggle_starred', 'Starring calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');

    equal(path(), 'purchases.tabs', 'Edit window should not open');

    equal(find('.alert:contains("Star updated")').length, 1, 'A success notification should appear');
  });
});


test('-Delete', function(){
  visit('/purchases?tab=New').then(function(){

    return click(find(buttons.purchaseDelete)[0]);
  }).then(function(){

    contains(mockResults.alertMessage, 'This will permanently delete this record', 'Clicking delete displays confirmation');
    equal(find(buttons.purchaseRow).length, 4, 'After deleting there should be 4 records');

    var purchases = helperMethods.store().all(App.Purchase).filter(function(rec){
      if (rec.id == 1) return true;
    });

    equal(purchases.length, 0, 'Deleted record should be removed from fixtures');

    equal(path(), 'purchases.tabs', 'Edit window should not open');

    equal(find('.alert:contains("Record deleted")').length, 1, 'A success notification should appear');
  });
});


test('-New Record', function(){

  visit('/purchases?tab=New').then(function(){

    return click(buttons.newButton);

  }).then(function(){
    equal(path(), 'purchase.new', 'Opening a record transitions to new');

  });
});

// Need to test that buttons only appear on New, Purchased, Reconciled

// Test that row dropdown works

// Test that 'Purchases' link works
