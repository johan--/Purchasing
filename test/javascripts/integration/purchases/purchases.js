
module('Purchases', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    injectFixtures();

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
  exists('.navbar', 'Loads the header');
  exists('.navbar-nav>.dropdown>a>i.fa-cog', 'Loads the navigation button');
  exists('.navbar-nav>.dropdown:has(a>i.fa-cog)>.dropdown-menu', 'Loads the navigation items');
  equal(find('.navbar-nav>.dropdown:has(a>i.fa-cog)>.dropdown-menu li').length, 3, 'Loads 3 navigation items');

  exists(buttons.searchBoxInput, 'Loads the search input');
  exists(buttons.searchAdvancedIcon, 'Loads the advanced search icon');
  exists(buttons.searchStart, 'Loads the search button');
  exists(buttons.searchModal, 'Loads the advanced search modal');

  exists(buttons.newButton, 'Loads the new button');

  // Tabs
  //exists(buttons.tabNew, 'Loads the New tab');
  //exists(buttons.tabPending, 'Loads the Pending tab');
  exists(buttons.tabPurchased, 'Loads the Purchased tab');
  exists(buttons.tabReconciled, 'Loads the Reconciled tab');
  exists(buttons.tabCancelled, 'Loads the Cancelled tab');
  exists(buttons.tabStarred, 'Loads the Cancelled tab');

  exists(buttons.pageNext, 'Loads the next page button');
  exists(buttons.pagePrevious, 'Loads the previous page button');
  exists(buttons.pageFirst, 'Loads the first page button');
  exists(buttons.pageLast, 'Loads the last page button');
});


test('-New Material Record', function(){
  visit('/purchases/tabs?purType=materials');

  var model = currentModel();

  expect(1);
  click(buttons.newButton);

  andThen(function(){
    equal(path(), 'purchase.new', 'Opening a record transitions to new');
    equal(model.get('purchase_type'), 'materials', 'A new material sets the purchase type');
  });
});


test('-New Material Record', function(){
  visit('/purchases/tabs?purType=services');

  var model = currentModel();

  expect(1);
  click(buttons.newButton);

  andThen(function(){
    equal(path(), 'purchase.new', 'Opening a record transitions to new');
    equal(model.get('purchase_type'), 'services', 'A new material sets the purchase type');
  });
});


test('-New Record from /purchases', function(){
  visit('/purchases');

  var model = currentModel();

  expect(1);
  click(buttons.newButton);

  andThen(function(){
    equal(path(), 'purchase.new', 'Opening a record transitions to new');
    equal(model.get('purchase_type'), 'materials', 'A new record defaults to materials purchase type');
  });
});


test('-New Record from url', function(){
  visit('/purchases/new');

  var model = currentModel();

  expect(1);

  andThen(function(){
    equal(model.get('purchase_type'), 'materials', 'A new record defaults to materials purchase type');
  });
});
