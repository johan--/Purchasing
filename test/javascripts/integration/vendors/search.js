
module('Integration - Vendors - Search', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
  }
});


test('Performing a search updates queryParams and search box', function() {
  expect(2);
  visit('/vendors');

  fillIn(buttons.searchBoxInput, 'testing');
  click(buttons.searchStart);

  andThen(function() {
    var controller = lookups.controller('vendors');

    equal(find(buttons.searchBoxInput).val(), 'testing', 'The quick search box is set');
    equal(controller.get('vendSearch'), 'testing', 'The queryParam is set');
  });
});


test('Visiting a search URL updates queryParams and search box', function() {
  expect(2);
  visit('/vendors?vendSearch=Gra');

  andThen(function() {
    var controller = lookups.controller('vendors');

    equal(find(buttons.searchBoxInput).val(), 'Gra', 'The quick search box is set');
    equal(controller.get('vendSearch'), 'Gra', 'The queryParam is set');
  });
});


test('Visiting a blank URL adds correct value to search field', function() {
  expect(2);
  visit('/vendors');

  andThen(function() {
    var controller = lookups.controller('vendors');

    equal(find(buttons.searchBoxInput).val(), '', 'The quick search box is empty');
    equal(controller.get('vendSearch'), null, 'The queryParam is empty');
  });
});
