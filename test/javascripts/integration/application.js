
module('Application', {
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

test('Root redirects to purchases', function(){
  expect(1);
  visit('/').then(function () {
    equal(path(), 'purchases.tabs', 'Root redirects to /purchases');
  });
});

test('User object', function(){
  expect(6);
  visit('/');

  andThen(function(){
    ok(!Ember.isEmpty(App.current_user.id), 'User id is empty');
    ok(!Ember.isEmpty(App.current_user.username), 'Username is empty');
    ok(!Ember.isEmpty(App.current_user.name), 'User name is empty');
    ok(!Ember.isEmpty(App.current_user.email), 'User email is empty');
    ok(!Ember.isEmpty(App.current_user.roles), 'User role is empty');
    ok(!Ember.isEmpty(App.current_user.photo_url), 'User photo_url is empty');
  });
});
