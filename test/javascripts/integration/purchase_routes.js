module('Purchases Route integration tests', {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
  },
  teardown: function() {
    App.reset();
  }
});

test('Initial Redirect', function(){
  expect(1);
  visit('/').then(function () {
    equal(path(), 'purchases.index', 'Redirects to /purchases');
  });
});

test('Purchase count', function(){
  visit('/').then(function(){
    equal(find('.purchase').length, 5, 'Page should show 15 purchases at a time');
  });
});
