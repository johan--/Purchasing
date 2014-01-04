
module('Purchase Edit', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();

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
    mockResults.clearMockResults();
  }

});

test('Route name is purchase.edit', function(){
  visit('/purchases/1/edit').then(function(){
    equal(path(), 'purchase.edit', 'PAth is set to purchase.edit');
  });
});

test('Route name is purchase.show', function(){
  visit('/purchases/1/show').then(function(){
    equal(path(), 'purchase.show', 'Path is set to purchase.show');
    equal(find('input').length, 0, 'There should be no inputs in show');
  });
});

test('Clicking edit button transitions to edit', function(){
  visit('/purchases/1/show').then(function(){
    return click(find(buttons.purchaseStartEdit));
  }).then(function(){
    equal(path(), 'purchase.edit', 'Clicking edit button in show transitions to purchase.edit');

    return click(find(buttons.purchaseStartEdit));
  }).then(function(){
    equal(path(), 'purchase.show', 'Clicking edit button in edit transitions to purchase.show');
  });
});

test('Claim a record', function() {

  visit('/purchases/1/edit').then(function(){
    var cur_user = helperMethods.model('purchase').get('buyer');
    equal(cur_user, null, 'Current record is not assigned');

    return click(buttons.purchaseClaim);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/assign', 'It sends an ajax request to assign the user');
    equal(mockResults.ajaxParams.data.user_id, '5', 'It sends the userss ID');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'It sends the purchase ID as an array');
  });
});

test('Unclaim a record', function() {

  updateTestFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });

   visit('/purchases/1/edit').then(function(){

    return click(buttons.purchaseUnclaim);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/assign', 'It sends an ajax request to unassign the user');
    equal(mockResults.ajaxParams.data.user_id, null, 'It sends null for the user ID');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'It sends the purchase ID as an array');

  });;
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

