module('Purchases Route integration tests', {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
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

    // Content
    equal(find('.purchase').length, 5, 'Should show 5 purchases');
 });
});

test('purchases Tab New', function(){
  visit('/').then(function(){
    return click('.tab:contains("New")');
  }).then(function(){
    ok(exists('.button:contains("Assigning")'), 'The assigning button was loaded');
  });
});

test('purchases Tab Purchased', function(){
  visit('/').then(function(){
    return click('.tab:contains("Purchased")');
  }).then(function(){
    ok(exists('.button:contains("Reconciling")'), 'The assigning button was loaded');
  });
});

test('purchases Tab Reconciled', function(){
  visit('/').then(function(){
    return click('.tab:contains("Reconciled")');
  }).then(function(){
    ok(exists('.button:contains("Un-Reconciling")'), 'The assigning button was loaded');
  });
});
