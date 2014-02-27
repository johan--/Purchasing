
module('Integration - Vendors - Letters', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/vendors');
  },

  teardown: function() {
  }
});


test('Default is All', function() {

  var controller = lookups.controller('vendors');

  equal(controller.get('letter'), 'All', 'The default is All');

});

test('Clicking a letter sets the queryParam', function() {
  expect(2);
  var controller = lookups.controller('vendors');
  click(find(buttons.vendorLetter)[1]);

  andThen(function() {

    equal(controller.get('letter'), 'A', 'The controller has the correct queryParam');
    contains(find(buttons.vendorLetter).eq(1).attr('class'), 'active', 'The letter has the active class');

  });
});


test('Binding from route to queryParam', function() {
  expect(2);
  visit('/vendors?letter=B');
  var controller = lookups.controller('vendors');

  andThen(function() {

    equal(controller.get('letter'), 'B', 'The controller has the correct queryParam');
    contains(find(buttons.vendorLetter).eq(2).attr('class'), 'active', 'The letter has the active class');

  });
});
