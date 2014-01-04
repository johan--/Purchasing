
module('LineItems', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadataFor('purchase');

    // Clear fixtures
    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: null,
                                       dateReconciled: null,
                                       dateCancelled: null });
  },

  teardown: function() {
  }

});

test('AddNewLineObjects defaults to one new line and note', function(){
  visit('/purchases/1/edit');

  andThen(function(){
    var model = helperMethods.model('purchase');
    equal(model.get('lineItems.length'), 1, 'One line item is added');
    equal(model.get('notes.length'), 1, 'One note is added');
  });
});

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


