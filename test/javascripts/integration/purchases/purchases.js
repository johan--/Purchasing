
module('Purchases', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases');
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});

test('Purchases DOM elements', function(){
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

test('-Purchases field sorters', function(){
  var metadata = getMetadataFor('purchase');

  // Buyer Cell
  click(buttons.buyerHeaderCell).then(function(){
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

test('-New Record', function(){

  click(buttons.newButton);

  andThen(function(){
    equal(path(), 'purchase.new', 'Opening a record transitions to new');
  });
});
