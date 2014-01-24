
module('Application', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
    mockResults.clearMockResults();
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
    ok(!Ember.isEmpty(App.current_user.id), 'User id is not empty');
    ok(!Ember.isEmpty(App.current_user.username), 'User id is not empty');
    ok(!Ember.isEmpty(App.current_user.name), 'User id is not empty');
    ok(!Ember.isEmpty(App.current_user.email), 'User id is not empty');
    ok(!Ember.isEmpty(App.current_user.role), 'User id is not empty');
    ok(!Ember.isEmpty(App.current_user.photo_url), 'User id is not empty');
  });
});
