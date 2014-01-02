
var testRoute = null;

module('PurchaseRoute', {
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


test('Adding a new line item', function(){
  visit('/purchases/1/edit').then(function(){
    var el = find(buttons.lineDescription)[0];

    click(el);
    fillIn(el, 'Test Description');
    focusOut(el);

    andThen(function(){
      var model = helperMethods.model('purchase');
      equal(model.get('lineItems.length'), 2, 'New line is added after adding one');
    });
  });
});

test('Adding a new note', function(){
  visit('/purchases/1/edit').then(function(){
    var el = find(buttons.noteText)[0];

    click(el);
    fillIn(el, 'Test Note');
    focusOut(el);

    andThen(function(){
      var model = helperMethods.model('purchase');
      equal(model.get('notes.length'), 2, 'New note is added after adding one');
    });
  });
});

