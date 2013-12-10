
module('Purchases Filtering', {
  setup: function() {
    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadata('purchase');
  },

  teardown: function() {
    ajax_params = null;
  }
});

test('-Filtering', function(){
  expect(0);

  // Clicking filter button opens modal

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

});
