
module('Integration - Purchases - Main', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases');
  },

  teardown: function() {

  }
});


test('Purchases DOM elements', function() {
  expect(17);

  // Title and navigation
  exists('.navbar', 'Loads the header');
  exists('.navbar-nav>.dropdown>a>i.fa-cog', 'Loads the navigation button');
  exists('.navbar-nav>.dropdown:has(a>i.fa-cog)>.dropdown-menu', 'Loads the navigation items');
  equal(find('.navbar-nav>.dropdown:has(a>i.fa-cog)>.dropdown-menu li').length, 5, 'Loads 5 navigation items');

  exists(buttons.searchBoxInput, 'Loads the search input');
  exists(buttons.searchAdvancedIcon, 'Loads the advanced search icon');
  exists(buttons.searchStart, 'Loads the search button');
  exists(buttons.searchModal, 'Loads the advanced search modal');

  exists(buttons.newButton, 'Loads the new button');

  // Tabs
  //exists(buttons.tabNew, 'Loads the New tab');
  //exists(buttons.tabPending, 'Loads the Pending tab');
  //exists(buttons.tabReconciled, 'Loads the Reconciled tab');
  exists(buttons.tabPurchased, 'Loads the Purchased tab');
  exists(buttons.tabReceived, 'Loads the Received tab');
  exists(buttons.tabCanceled, 'Loads the Canceled tab');
  exists(buttons.tabStarred, 'Loads the Canceled tab');

  exists(buttons.pageNext, 'Loads the next page button');
  exists(buttons.pagePrevious, 'Loads the previous page button');
  exists(buttons.pageFirst, 'Loads the first page button');
  exists(buttons.pageLast, 'Loads the last page button');
});
