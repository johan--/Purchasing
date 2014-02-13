
module('Attachment', {
  setup: function() {
    // Build fixtures
    fixtures.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/attachments');
  },

  teardown: function() {
  }
});
