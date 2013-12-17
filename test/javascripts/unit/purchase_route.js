// https://github.com/emberjs/ember.js/blob/master/packages/ember/tests/routing/basic_test.js

var testRoute = null;

module('Purchases', {
  setup: function() {
    App.reset();

    testRoute = helperMethods.route('purchases.tabs');
    testRoute.reopen({
      transitionTo: function(url, params) {
        Ember.merge(mockResults, { url: url, params: params });
      }
    });

    App.Router.reopen({
      location: 'none'
    });
    App.Router.map(function() {
      this.route("home", { path: "/" });
    });

    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});


// queryParams
asyncTest('Can change the page', function(){

  wait().then(function(){
    testRoute.send('page', 5);
    equal(mockResults.params.page, 5, 'The page was changed');

    start();
  });
});

test('Can send a new tab param', function(){
  testRoute.send('newPage', { tab: 'New' });
  equal(mockResults.params.tab, 'New');
});

test('Can reload the page', function(){
  testRoute.send('reloadPage');
  equal(mockResults.params.current_mode, 1);
  testRoute.send('reloadPage');
  equal(mockResults.params.current_mode, 0);
});
