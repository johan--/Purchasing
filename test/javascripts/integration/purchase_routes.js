module('Purchases Route integration tests', {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
    metadata = getMetadata('purchase');
  },
  teardown: function() {
    App.reset();
  }
});

test('/', function(){
  expect(1);
  visit('/').then(function () {
    equal(path(), 'purchases', 'Redirects to /purchases');
  });
});

test('/purchases', function(){
  visit('/').then(function(){

    // Title and navigation
    ok(exists('.header_title'), 'The header was loaded');
    ok(exists('.navigation_menu'), 'The navigation button was loaded');
    ok(exists('.navigation_items'), 'The navigation items were loaded');
    equal(find('.navigation_items li').length, 7, 'Should show 7 navigation items');

    ok(exists('.search_box_input'), 'The search input was loaded');
    ok(exists('span[title*="Advanced Search"]'), 'The advanced search icon was loaded');
    ok(exists('.circle_button[title*="search"]'), 'The search button was loaded');
    ok(exists('.advanced_search_box'), 'The advanced search modal was loaded');

    ok(exists('.circle_button[title*="New"]'), 'The new button was loaded');
    ok(exists('.circle_button[title*="Reload"]'), 'The reload button was loaded');

    // Tabs
    ok(exists('.tab:contains("New")'), 'The New tab was loaded');
    ok(exists('.tab:contains("Pending")'), 'The Pending tab was loaded');
    ok(exists('.tab:contains("Purchased")'), 'The Purchased tab was loaded');
    ok(exists('.tab:contains("Reconciled")'), 'The Reconciled tab was loaded');
    ok(exists('.tab:contains("Cancelled")'), 'The Cancelled tab was loaded');

    // Right controls (Default)
    ok(exists('.button:contains("Filter")'), 'The filter button was loaded');
    ok(exists('span[title*="Go to previous page"]'), 'The previous page button was loaded');
    ok(exists('span[title*="Go to next page"]'), 'The next page button was loaded');
 });
});

test('-Purchases tabs', function(){
  visit('/').then(function(){


  // New Tab
    return click('.tab:contains("New")');
  }).then(function(){
    equal(metadata.tab, 'New', 'Click New tab should set metadata');

    ok(exists('.button:contains("Assigning")'), 'The assigning button was loaded');

    updateTestFixtures(App.Purchase, { datePurchased: null,
                                buyer: null,
                                dateReconciled: null,
                                dateCancelled: null });

    return click('.tab:contains("New")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Should show 5 purchases for New Tab');

  }).then(function(){


  // Pending Tab
    return click('.tab:contains("Pending")');
  }).then(function(){
    equal(metadata.tab, 'Pending', 'Click Pending tab should set metadata');

    equal(find('.purchase').length, 0, 'Should show 0 purchases with no data for Pending Tab');

    updateTestFixtures(App.Purchase, { datePurchased: null,
                                buyer: { id: 15, name: 'A test buyer' },
                                dateReconciled: null,
                                dateCancelled: null });

    return click('.tab:contains("Pending")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Should show 5 purchases with data Pending Tab');

  }).then(function(){


  // Purchased Tab
    return click('.tab:contains("Purchased")');
  }).then(function(){
    equal(metadata.tab, 'Purchased', 'Click Purchased tab should set metadata');

    ok(exists('.button:contains("Reconciling")'), 'The assigning button was loaded');

    equal(find('.purchase').length, 0, 'Should show 0 purchases with no data for Purchased Tab');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                buyer: { id: 15, name: 'A test buyer' },
                                dateReconciled: null,
                                dateCancelled: null });

    return click('.tab:contains("Purchased")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Should show 5 purchases with data for Purchased Tab');

  }).then(function(){


  // Reconciled Tab
    return click('.tab:contains("Reconciled")');
  }).then(function(){
    equal(metadata.tab, 'Reconciled', 'Click Reconciled tab should set metadata');

    ok(exists('.button:contains("Un-Reconciling")'), 'The assigning button was loaded');

    equal(find('.purchase').length, 0, 'Should show 0 purchases with no data for Reconciled Tab');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                buyer: { id: 15, name: 'A test buyer' },
                                dateReconciled: moment().format(APP_DATE_STRING),
                                dateCancelled: null });

    return click('.tab:contains("Reconciled")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Should show 5 purchases with data for Reconciled Tab');

  }).then(function(){


  // Cancelled Tab
    return click('.tab:contains("Cancelled")');
  }).then(function(){
    equal(metadata.tab, 'Cancelled', 'Click Cancelled tab should set metadata');

    equal(find('.purchase').length, 0, 'Should show 0 purchases with no data for Cancelled Tab');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                buyer: { id: 15, name: 'A test buyer' },
                                dateReconciled: moment().format(APP_DATE_STRING),
                                dateCancelled: moment().format(APP_DATE_STRING) });

    return click('.tab:contains("Cancelled")');
  }).then(function(){
    equal(find('.purchase').length, 5, 'Should show 5 purchases with data for Cancelled Tab');


  // Finally check that new tab is working as empty
    return click('.tab:contains("New")');
  }).then(function(){
    equal(find('.purchase').length, 0, 'Should show 0 purchases with no data for New Tab');

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
