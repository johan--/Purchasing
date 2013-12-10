
module('Purchases Filtering', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadataFor('purchase');
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});

// Clicking filter button opens modal
test('-Filtering: Open modal', function(){
  visit('/purchases').then(function(){

  return click(buttons.filterButton);
  }).then(function(){
    ok(isVisible(buttons.filterModal), 'Filter Modal should be visible');

  });
});


// Buyer list isn't empty
test('-Filtering: Buyer list isnt empty', function(){
  visit('/purchases').then(function(){

  return click(buttons.filterButton);
  }).then(function(){
    var selectDom = $('select', 'dl:has(dt:contains("Filter by Buyer"))');
    ok(selectDom.children('option').length > 2, 'Buyer filter includes buyers');

  });
});

// Clear filters clears fields

// Each field submits correct ajax

// Included received reads from metadata

// Included pending reads from metadata

// Buyer reads from metadata

// Vendor reads from metadata

// Min Date reads from metadata

// Max Date reads from metadata

// Date shortcuts
