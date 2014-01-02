
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


test('Sets isEdit on Edit / New and not Show', function(){
  visit('/purchases/new').then(function(){
    equal(helperMethods.controller('purchase.new').get('isEditing'), true, 'New sets isEditing to true');

    return visit('/purchases/1/edit');
  }).then(function(){
    equal(helperMethods.controller('purchase.edit').get('isEditing'), true, 'Edit sets isEditing to true');

    return visit('/purchases/1/show');
  }).then(function(){
    equal(helperMethods.controller('purchase.show').get('isEditing'), false, 'Show sets isEditing to false');
  });
});

test('AddNewLineObjects defaults to one new line and note', function(){
  visit('/purchases/1/edit');

  andThen(function(){
    var model = helperMethods.model('purchase');
    equal(model.get('lineItems.length'), 1, 'One line item is added');
    equal(model.get('notes.length'), 1, 'One note is added');
  });
});

