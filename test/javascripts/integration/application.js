module('Application', {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
    metadata = getMetadata('purchase');
  },
  teardown: function() {
    App.reset();
  }
});

test('Root redirects to purchases', function(){
  expect(1);
  visit('/').then(function () {
    equal(path(), 'purchases', 'Root redirects to /purchases');
  });
});
