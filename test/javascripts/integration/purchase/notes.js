
module('Notes', {
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

