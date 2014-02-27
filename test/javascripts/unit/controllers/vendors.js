
module('Unit - Controllers - Vendors', {
  setup: function() {
    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/vendors');
  },

  teardown: function() {
  }
});


test('New controller reverts to isEditing=true on close', function() {
  expect(2);
  var controller = lookups.controller('vendorNew');

  equal(controller.get('isEditing'), true, 'Initially the controller is new');

  Ember.run(function() {
    controller.send('close');
  });

  andThen(function() {

    equal(controller.get('isEditing'), true, 'Initially the controller is new');

  });
});
