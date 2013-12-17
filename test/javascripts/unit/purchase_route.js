// https://github.com/emberjs/ember.js/blob/master/packages/ember/tests/routing/basic_test.js

var testRoute = null;

module('PurchasesRoute', {
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


function setupMockRoute(){
  testRoute = helperMethods.route('purchases.tabs');
  testRoute.reopen({
    transitionTo: function(url, params) {
      Ember.merge(mockResults, { url: url, params: params });
      this._super(url, params);
     },

    replaceWith: function(url, params) {
      Ember.merge(mockResults, { url: url, params: params });
      this._super(url, params);
    }
  });
}

//TODO: Is there a way to get the route to initialize without visiting '/'?

// queryParams

test('Can change the page', function(){
  visit('/').then(function(){
    setupMockRoute();

    testRoute.send('page', 5);
    equal(mockResults.params.queryParams.purPage, 5, 'The page was changed');
  });
});

test('Can send a new tab param', function(){
  visit('/').then(function(){
    setupMockRoute();

    testRoute.send('newPage', { tab: 'New' });
    equal(mockResults.params.queryParams.tab, 'New');
  });
});

test('Can reload the page', function(){
  visit('/').then(function(){
    setupMockRoute();

    testRoute.send('reloadPage');
    equal(mockResults.params.queryParams.mode, 1, 'First click sets mode to 1');

    return wait();
  }).then(function(){
    testRoute.send('reloadPage');
    equal(mockResults.params.queryParams.mode, 0, 'First click sets mode to 0');
    console.log(mockResults.params.queryParams);
  });
});
