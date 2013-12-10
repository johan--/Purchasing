
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
  expect(0);
  visit('/purchases').then(function(){

  });
});


// Buyer list isn't empty

// Clear filters clears fields

// Each field submits correct ajax

// Included received reads from metadata

// Included pending reads from metadata

// Buyer reads from metadata

// Vendor reads from metadata

// Min Date reads from metadata

// Max Date reads from metadata

// Date shortcuts
