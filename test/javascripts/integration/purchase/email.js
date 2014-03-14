
module('Integration - Purchase - Email', {
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


test('To Validation', function() {
  expect(0);
  click(buttons.purchaseEditEmail);

  andThen(function() {

  });
});


test('Subject Validation', function() {
  expect(0);
  click(buttons.purchaseEditEmail);

  andThen(function() {

  });
});


test('Body Validation', function() {
  expect(0);
  click(buttons.purchaseEditEmail);

  andThen(function() {

  });
});


test('If server does not return 200, window stays open', function() {
  expect(0);
  click(buttons.purchaseEditEmail);

  andThen(function() {

  });
});
