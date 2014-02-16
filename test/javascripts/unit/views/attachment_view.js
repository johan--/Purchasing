
module('Unit - Views - Attachment', {
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
