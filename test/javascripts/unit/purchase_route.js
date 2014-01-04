
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
  testRoute = helperMethods.route('purchase.edit');
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

test('AddLines Unit test', function(){
  visit('/purchases/1/edit').then(function(){
    setupMockRoute();
    var model = helperMethods.model('purchase');

    testRoute.addNewLineObjects();
    equal(model.get('lineItems.length'), 2, '1 Line item created by AddLines');
    equal(model.get('notes.length'), 2, '1 Note created by AddLines');
  });
});

