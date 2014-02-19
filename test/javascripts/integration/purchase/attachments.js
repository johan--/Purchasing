
module('Integration - Purchase - Attachments', {
  setup: function() {

    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {
  }

});


// Can open modal
// Assigned observes correctly
// Unassigned observes correctly
// Each tab observes correctly
// Click opens controls
// Unassigned > assigned works
// Assigned > unassigned works
// Controls only exist for buyers
// Assign/unassign fails for non-buyers
// Assign/unassign will fail if an attachment is still being processed

// Simulate drop on category
// Simulate drop on assigned
// Simulate drop on unassigned
