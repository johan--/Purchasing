
module('PurchaseRoute', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
  }
});

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
    mockResults.addMockToRoute('purchase.edit');

    var model = helperMethods.model('purchase'),
        testRoute = helperMethods.route('purchase.edit');

    testRoute.addNewLineObjects(model);
    equal(model.get('lineItems.length'), 2, '1 Line item created by AddLines');
    equal(model.get('notes.length'), 2, '1 Note created by AddLines');
  });
});

