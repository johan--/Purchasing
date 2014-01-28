
module('Purchases', {
  setup: function() {
    mockResults.clearMockResults();

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases');
  },

  teardown: function() {
  }
});


test('Purchases DOM elements', function(){
  expect(19);

  // Title and navigation
  ok(exists('.navbar'), 'Loads the header');
  ok(exists('.navbar-nav>.dropdown>a>i.fa-cog'), 'Loads the navigation button');
  ok(exists('.navbar-nav>.dropdown:has(a>i.fa-cog)>.dropdown-menu'), 'Loads the navigation items');
  equal(find('.navbar-nav>.dropdown:has(a>i.fa-cog)>.dropdown-menu li').length, 3, 'Loads 3 navigation items');

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


test('-New Record', function(){
  expect(1);
  click(buttons.newButton);

  andThen(function(){
    equal(path(), 'purchase.new', 'Opening a record transitions to new');
  });
});
