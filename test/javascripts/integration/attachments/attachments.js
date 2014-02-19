
module('Integration - Attachments - Main', {
  setup: function() {

    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/attachments');
  },

  teardown: function() {
  }

});

// Only shows unassigned attachments
// Test click
// Test attachments > new transitions correctly (with none, 1, multiple)
// Test attachments > new will fail if any records are in process
// Simulate drop
