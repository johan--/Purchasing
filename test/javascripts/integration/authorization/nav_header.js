
module('Authorization - Nav Header', {
  setup: function() {
    mockResults.clearMockResults();

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

  },

  teardown: function() {
  }
});


test('As an employee', function(){
  expect(4);
  visit('/purchases/tabs?tab=New').then(function(){

    var model = helperMethods.model().get('firstObject');

    Ember.run(function(){
      App.current_user.set('roles', ['employee']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    notExists(buttons.navBarVendors, 'The vendors nav button does not exist');
    notExists(buttons.navBarOptions, 'The nav options menu does not exist');
    notExists(buttons.navBarOptionsTags, 'The nav options tag menu does not exist');
    notExists(buttons.navBarOptionsUsers, 'The nav options user menu does not exist');

  });
});


test('As a receiver', function(){
  expect(4);
  visit('/purchases/tabs?tab=New').then(function(){

    var model = helperMethods.model().get('firstObject');

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    notExists(buttons.navBarVendors, 'The vendors nav button does not exist');
    notExists(buttons.navBarOptions, 'The nav options menu does not exist');
    notExists(buttons.navBarOptionsTags, 'The nav options tag menu does not exist');
    notExists(buttons.navBarOptionsUsers, 'The nav options user menu does not exist');

  });
});


test('As a Buyer', function(){
  expect(4);
  visit('/purchases/tabs?tab=New').then(function(){

    var model = helperMethods.model().get('firstObject');

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    exists(buttons.navBarVendors, 'The vendors nav button does exist');
    exists(buttons.navBarOptions, 'The nav options menu does exist');
    exists(buttons.navBarOptionsTags, 'The nav options tag menu does exist');
    exists(buttons.navBarOptionsUsers, 'The nav options user menu does exist');

  });
});
