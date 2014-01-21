
module('Purchase Edit', {
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
    visit('/purchases/1/edit');
  },

  teardown: function() {
  }

});

test('Route name is purchase.edit', function(){
  equal(path(), 'purchase.edit', 'PAth is set to purchase.edit');
});

test('Route name is purchase.show', function(){
  visit('/purchases/1/show');

  andThen(function(){
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
  var cur_user = helperMethods.model('purchase').get('buyer');

  equal(cur_user, null, 'Current record is not assigned');

  click(buttons.purchaseClaim);

  andThen(function(){
    equal(mockResults.ajaxParams.url, '/purchases/assign', 'It sends an ajax request to assign the user');
    equal(mockResults.ajaxParams.data.user_id, '5', 'It sends the userss ID');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'It sends the purchase ID as an array');
  });
});

test('Unclaim a record', function() {

  updateTestFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show'); // Best way to refresh the route with new data

  click(buttons.purchaseUnclaim);

  andThen(function(){
    equal(mockResults.ajaxParams.url, '/purchases/assign', 'It sends an ajax request to unassign the user');
    equal(mockResults.ajaxParams.data.user_id, null, 'It sends null for the user ID');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'It sends the purchase ID as an array');
  });
});

test('Date requested validation - Empty', function(){
  var model = helperMethods.model();

  Ember.run(function(){
    model.set('dateRequested', null);
  });

  andThen(function(){
    contains(find(buttons.dateRequestedField).attr('class'), 'has-error', 'An empty date-requested is error');
  });
});

test('Date requested validation - Not-empty', function(){
  var model = helperMethods.model();

  Ember.run(function(){
    model.set('dateRequested', 'Jan 1, 2014');
  });

  andThen(function(){
    equal(find(buttons.dateRequestedField).attr('class'), '', 'A non-empty date-requested is not error');
  });
});
