
module('PurchaseRoute', {
  setup: function() {
    // Build fixtures
    injectFixtures();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {

  }
});


test('Sets isEdit on Edit / New and not Show', function(){
  expect(3);
  visit('/purchases/new').then(function(){
    equal(lookupController('purchase.new').get('isEditing'), true, 'New sets isEditing to true');

    return visit('/purchases/1/edit');
  }).then(function(){
    equal(lookupController('purchase.edit').get('isEditing'), true, 'Edit sets isEditing to true');

    return visit('/purchases/1/show');
  }).then(function(){
    equal(lookupController('purchase.show').get('isEditing'), false, 'Show sets isEditing to false');
  });
});


test('AddLines Unit test', function(){
  expect(2);
  visit('/purchases/1/edit').then(function(){
    var model = currentModel(),
        testRoute = lookupRoute('purchase.edit');

    testRoute.addNewLineObjects(model);

    equal(model.get('lineItems.length'), 2, '1 Line item created by AddLines');
    equal(model.get('notes.length'), 2, '1 Note created by AddLines');
  });
});

