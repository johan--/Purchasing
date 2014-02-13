
module('Users - Search', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {

  }
});


test('- Performing a search updates queryParams and search box', function() {
  visit('/users');

  fillIn(buttons.searchBoxInput, 'testing');
  click(buttons.searchStart);

  andThen(function() {
    var controller = lookups.controller('users');

    equal(find(buttons.searchBoxInput).val(), 'testing', 'The quick search box is set');
    equal(controller.get('userSearch'), 'testing', 'The queryParam is set');
  });
});


test('- Visiting a search URL updates queryParams and search box', function() {
  visit('/users?userSearch=Gra');

  andThen(function(){
    var controller = lookups.controller('users');

    equal(find(buttons.searchBoxInput).val(), 'Gra', 'The quick search box is set');
    equal(controller.get('userSearch'), 'Gra', 'The queryParam is set');
  });
});


test('- Visiting a blank URL adds correct value to search field', function() {
  visit('/users');

  andThen(function(){
    var controller = lookups.controller('users');

    equal(find(buttons.searchBoxInput).val(), '', 'The quick search box is empty');
    equal(controller.get('userSearch'), null, 'The queryParam is empty');
  });
});
