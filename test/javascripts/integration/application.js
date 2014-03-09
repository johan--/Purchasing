
module('Integration - Application', {
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

test('Root redirects to purchases', function() {
  expect(1);
  visit('/').then(function () {
    equal(lookups.path(), 'purchases.tabs', 'Root redirects to /purchases');
  });
});

test('User object', function() {
  expect(6);
  visit('/');

  andThen(function() {
    ok(!Ember.isEmpty(App.Session.currentUser.id), 'User id is not empty');
    ok(!Ember.isEmpty(App.Session.currentUser.username), 'Username is not empty');
    ok(!Ember.isEmpty(App.Session.currentUser.name), 'User name is not empty');
    ok(!Ember.isEmpty(App.Session.currentUser.email), 'User email is not empty');
    ok(!Ember.isEmpty(App.Session.currentUser.roles), 'User role is not empty');
    ok(!Ember.isEmpty(App.Session.currentUser.photo_url), 'User photo_url is not empty');
  });
});
