
module('Integration - Purchase - Notes', {
  setup: function() {

    // Build fixtures
    fixtures.injectFixtures();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {

  }

});
