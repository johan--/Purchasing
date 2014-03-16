
module('Unit - Routes - Purchases Tabs', {
  setup: function() {
    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
  }
});

test('one', function() {
  expect(0)

  visit('/')
})
