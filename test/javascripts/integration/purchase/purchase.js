
module('Purchase Edit', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

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
  var cur_user = helperMethods.model().get('buyer');

  equal(cur_user, null, 'Current record is not assigned');

  click(buttons.purchaseClaim);

  andThen(function(){
    equal(mockResults.ajaxParams.url, '/purchases/assign', 'It sends an ajax request to assign the user');
    ok(!Ember.isEmpty(mockResults.ajaxParams.data.user_id), 'It sends the userss ID');
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

test('Ordered button - Down', function() {
  var model = helperMethods.model();

  click(buttons.purchaseOrdered);

  andThen(function(){
    equal(Ember.isEmpty(model.get('datePurchased')), false, 'Clicking the ordered button adds the date');
    contains(find(buttons.purchaseOrdered).attr('class'), 'active', 'Clicking the ordered button adds the active class');
  });
});

test('Ordered button - Up', function() {
  var model = helperMethods.model();

  Ember.run(function(){
    model.set('datePurchased', '1/1/2014');
  });
  click(buttons.purchaseOrdered);

  andThen(function(){
    equal(Ember.isEmpty(model.get('datePurchased')), true, 'Clicking the ordered button removes the date');
    notContains(find(buttons.purchaseOrdered).attr('class'), 'active', 'Clicking the ordered button removes the active class');
  });
});


test('Cancelled button only appears when there is a buyer', function(){
  var model = helperMethods.model();

  isHidden(buttons.purchaseEditCancel, 'Without a buyer set the cancelled button is not visible');

  Ember.run(function(){
    model.set('buyer', { id: 123, name: 'test' });
  });

  andThen(function(){
    isVisible(buttons.purchaseEditCancel, 'Once a buyer is set the cancelled button is visible');
  });
});

test('Cancelled button - Down', function() {
  var model = helperMethods.model();

  Ember.run(function(){
    model.set('buyer', { id: 123, name: 'test' });
  });

  click(buttons.purchaseEditCancel);

  andThen(function(){
    equal(Ember.isEmpty(model.get('dateCancelled')), false, 'Clicking the Cancelled button adds the date');
    contains(find(buttons.purchaseEditCancel).attr('class'), 'active', 'Clicking the Cancelled button adds the active class');
  });
});

test('Cancelled button - Up', function() {
  var model = helperMethods.model();

  Ember.run(function(){
    model.set('buyer', { id: 123, name: 'test' });
    model.set('dateCancelled', '1/1/2014');
  });

  click(buttons.purchaseEditCancel);

  andThen(function(){
    equal(Ember.isEmpty(model.get('dateCancelled')), true, 'Clicking the Cancelled button removes the date');
    notContains(find(buttons.purchaseEditCancel).attr('class'), 'active', 'Clicking the Cancelled button removes the active class');
  });
});

test('Deleted button only appears when not ordered', function(){
  var model = helperMethods.model();

  isVisible(buttons.purchaseEditDelete);

  Ember.run(function(){
    model.set('datePurchased', '1/1/2014');
  });

  andThen(function(){
    isHidden(buttons.purchaseEditDelete);
  });
});

test('Delete button deletes record and redirects', function(){
  var model = helperMethods.model();

  click(buttons.purchaseEditDelete);

  andThen(function(){
    equal(model.get('isDeleted'), true, 'Record is flagged as deleted');
    contains(mockResults.alertMessage, 'permanently delete this record', 'A confirmation dialog exists when you try to delete the record');
    equal(path(), 'purchases.tabs', 'After deleting the user is redirected to the main purchases list');
  });
});

test('Star a record', function(){
  var model = helperMethods.model();

  click(buttons.purchaseEditStar);

  andThen(function(){
    equal(Ember.isEmpty(model.get('starred')), false, 'The record is starred');
    equal(model.get('isDirty'), true, 'The record is flagged as dirty');
  });
});

test('Unstar a record', function(){
  visit('/purchases/1/show');
  var model = helperMethods.model();

  updateTestFixtures(App.Purchase, { starred: '1/1/2014' });
  visit('/purchases/1/edit');

  click(buttons.purchaseEditStar);

  andThen(function(){
    equal(Ember.isEmpty(model.get('starred')), true, 'The record is unstarred');
    equal(model.get('isDirty'), true, 'The record is flagged as dirty');
  });
});


test('Cancelled formatting', function(){
  visit('/purchases/1/show');
  var model = helperMethods.model();

  updateTestFixtures(App.Purchase, { dateCancelled: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    var el = find('.edit_box'),
        title = find('.edit_box>.title_bar');

    contains(el.attr('class'), 'is-cancelled', 'A cancelled record has the correct global class');
    contains(title.attr('class'), 'strikethrough', 'A cancelled record has the correct global class');
  });
});

test('Reconciled formatting', function(){
  visit('/purchases/1/show');
  var model = helperMethods.model();

  updateTestFixtures(App.Purchase, { dateReconciled: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    var el = find('.edit_box');

    contains(el.attr('class'), 'is-reconciled', 'A reconciled record has the correct global class');
  });
});
