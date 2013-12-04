module('Purchases', {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
    metadata = getMetadata('purchase');
  },
  teardown: function() {
    App.reset();
  }
});

test('Purchases DOM elements', function(){
  visit('/').then(function(){

    // Title and navigation
    ok(exists('.header_title'), 'Loads the header');
    ok(exists('.navigation_menu'), 'Loads the navigation button');
    ok(exists('.navigation_items'), 'Loads the navigation items');
    equal(find('.navigation_items li').length, 7, 'Loads 7 navigation items');

    ok(exists('.search_box_input'), 'Loads the search input');
    ok(exists('span[title*="Advanced Search"]'), 'Loads the advanced search icon');
    ok(exists('.circle_button[title*="search"]'), 'Loads the search button');
    ok(exists('.advanced_search_box'), 'Loads the advanced search modal');

    ok(exists('.circle_button[title*="New"]'), 'Loads the new button');
    ok(exists('.circle_button[title*="Reload"]'), 'Loads the reload button');

    // Tabs
    ok(exists('.tab:contains("New")'), 'Loads the New tab');
    ok(exists('.tab:contains("Pending")'), 'Loads the Pending tab');
    ok(exists('.tab:contains("Purchased")'), 'Loads the Purchased tab');
    ok(exists('.tab:contains("Reconciled")'), 'Loads the Reconciled tab');
    ok(exists('.tab:contains("Cancelled")'), 'Loads the Cancelled tab');

    // Right controls (Default)
    ok(exists('.button:contains("Filter")'), 'Loads the filter button');
    ok(exists('span[title*="Go to previous page"]'), 'Loads the previous page button');
    ok(exists('span[title*="Go to next page"]'), 'Loads the next page button');
 });
});

test('Purchases tabs', function(){
  visit('/').then(function(){


  // New Tab
    return click('.tab:contains("New")');
  }).then(function(){
    equal(metadata.tab, 'New', 'Click New tab should set metadata');

    ok(exists('.button:contains("Assigning")'), 'Click New tab should show the assigning button');

    updateTestFixtures(App.Purchase, { datePurchased: null,
                                buyer: null,
                                dateReconciled: null,
                                dateCancelled: null });

    return click('.tab:contains("New")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking New tab when there is data should show 5 records');

  }).then(function(){


  // Pending Tab
    return click('.tab:contains("Pending")');
  }).then(function(){
    equal(metadata.tab, 'Pending', 'Click Pending tab should set metadata');

    equal(find('.purchase').length, 0, 'Clicking Pending tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: null,
                                buyer: { id: 15, name: 'A test buyer' },
                                dateReconciled: null,
                                dateCancelled: null });

    return click('.tab:contains("Pending")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking Pending tab when there is data should show 5 records');

  }).then(function(){


  // Purchased Tab
    return click('.tab:contains("Purchased")');
  }).then(function(){
    equal(metadata.tab, 'Purchased', 'Click Purchased tab should set metadata');

    ok(exists('.button:contains("Reconciling")'), 'Click Purchased tab should show the reconciling button');

    equal(find('.purchase').length, 0, 'Clicking Purchased tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                buyer: { id: 15, name: 'A test buyer' },
                                dateReconciled: null,
                                dateCancelled: null });

    return click('.tab:contains("Purchased")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking Purchased tab when there is data should show 5 records');

  }).then(function(){


  // Reconciled Tab
    return click('.tab:contains("Reconciled")');
  }).then(function(){
    equal(metadata.tab, 'Reconciled', 'Click Reconciled tab should set metadata');

    ok(exists('.button:contains("Un-Reconciling")'), 'Click Reconciled tab should show the un-reconciling button');

    equal(find('.purchase').length, 0, 'Clicking Reconciled tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                buyer: { id: 15, name: 'A test buyer' },
                                dateReconciled: moment().format(APP_DATE_STRING),
                                dateCancelled: null });

    return click('.tab:contains("Reconciled")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking Reconciled tab when there is data should show 5 records');

  }).then(function(){


  // Cancelled Tab
    return click('.tab:contains("Cancelled")');
  }).then(function(){
    equal(metadata.tab, 'Cancelled', 'Click Cancelled tab should set metadata');

    equal(find('.purchase').length, 0, 'Clicking Cancelled tab when there is no data should show 0 records');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                buyer: { id: 15, name: 'A test buyer' },
                                dateReconciled: moment().format(APP_DATE_STRING),
                                dateCancelled: moment().format(APP_DATE_STRING) });

    return click('.tab:contains("Cancelled")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Clicking Cancelled tab when there is data should show 5 records');


  // Finally check that new tab is working as empty
    return click('.tab:contains("New")');
  }).then(function(){
    equal(find('.purchase').length, 0, 'Clicking New tab when there is no data should show 0 records');

  });
});


test('-Purchases field sorters', function(){
  visit('/').then(function(){


  // Buyer Cell
    return click('.buyer_cell_header');
  }).then(function(){
    equal(metadata.sort, 'buyer.name', 'Click buyer should sort by buyer');
    equal(metadata.direction, 'ASC', 'Click buyer first time should sort ASC');

    return click('.buyer_cell_header');
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click buyer second time should sort DESC');


  // Date Cell
    return click('.date_cell_header');
  }).then(function(){
    equal(metadata.sort, 'dateRequested', 'Click date should sort by date');
    equal(metadata.direction, 'ASC', 'Click date first time should sort ASC');

    return click('.date_cell_header');
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click date second time should sort DESC');


  // Vendor Cell
    return click('.vendor_cell_header');
  }).then(function(){
    equal(metadata.sort, 'vendorString', 'Click vendor should sort by vendor');
    equal(metadata.direction, 'ASC', 'Click vendor first time should sort ASC');

    return click('.vendor_cell_header');
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click vendor second time should sort DESC');


  // Requester Cell
    return click('.requester_cell_header');
  }).then(function(){
    equal(metadata.sort, 'requester.name', 'Click requester should sort by requester');
    equal(metadata.direction, 'ASC', 'Click requester first time should sort ASC');

    return click('.requester_cell_header');
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click requester second time should sort DESC');


  // Department Cell
    return click('.department_cell_header');
  }).then(function(){
    equal(metadata.sort, 'requester.department', 'Click department should sort by department');
    equal(metadata.direction, 'ASC', 'Click department first time should sort ASC');

    return click('.department_cell_header');
  }).then(function(){
    equal(metadata.direction, 'DESC', 'Click department second time should sort DESC');

  });
});
