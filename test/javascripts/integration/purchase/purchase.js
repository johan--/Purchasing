
module('Purchase Edit', {
  setup: function() {

    // Build fixtures
    fixtures.injectFixtures();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {

  }

});


test('- Route name is purchase.edit', function(){
  expect(1);

  equal(lookups.path(), 'purchase.edit', 'lookups.path is set to purchase.edit');
});


test('- Route name is purchase.show', function(){
  expect(2);

  Ember.run(function(){
    App.current_user.set('roles', ['employee']);
  });

  visit('/purchases/1/show');

  andThen(function(){
    equal(lookups.path(), 'purchase.show', 'lookups.path is set to purchase.show');
    equal(find('input').length, 0, 'There should be no inputs in show');
  });
});


test('- Clicking edit button transitions to edit', function(){
  expect(2);

  visit('/purchases/1/show').then(function(){
    return click(find(buttons.purchaseStartEdit));
  }).then(function(){
    equal(lookups.path(), 'purchase.edit', 'Clicking edit button in show transitions to purchase.edit');

    return click(find(buttons.purchaseStartEdit));
  }).then(function(){
    equal(lookups.path(), 'purchase.show', 'Clicking edit button in edit transitions to purchase.show');
  });
});


/*
test('- Claim a record', function() {
  expect(4);
  var cur_user = lookups.currentModel().get('buyer');

  equal(cur_user, null, 'Current record is not assigned');

  click(buttons.purchaseClaim);

  andThen(function(){
    equal(myMocks.ajaxParams.url, App.Globals.namespace + '/purchases/assign', 'It sends an ajax request to assign the user');
    ok(!Ember.isEmpty(myMocks.ajaxParams.data.user_id), 'It sends the userss ID');
    equal(myMocks.ajaxParams.data.ids[0], '1', 'It sends the purchase ID as an array');
  });
});


test('- Unclaim a record', function() {
  expect(3);

  fixtures.updateTestFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show'); // Best way to refresh the route with new data

  click(buttons.purchaseUnclaim);

  andThen(function(){
    equal(myMocks.ajaxParams.url, App.Globals.namespace + '/purchases/assign', 'It sends an ajax request to unassign the user');
    equal(myMocks.ajaxParams.data.user_id, null, 'It sends null for the user ID');
    equal(myMocks.ajaxParams.data.ids[0], '1', 'It sends the purchase ID as an array');
  });
});
*/

test('- Date requested validation - Empty', function(){
  expect(1);
  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('dateRequested', null);
  });

  andThen(function(){
    contains(find(buttons.dateRequestedField).attr('class'), 'has-error', 'An empty date-requested is error');
  });
});


test('- Date requested validation - Not-empty', function(){
  expect(1);
  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('dateRequested', 'Jan 1, 2014');
  });

  andThen(function(){
    equal(find(buttons.dateRequestedField).attr('class'), '', 'A non-empty date-requested is not error');
  });
});


test('- Ordered button - Down', function() {
  expect(2);
  var model = lookups.currentModel();

  click(buttons.purchaseOrdered);

  andThen(function(){
    equal(Ember.isEmpty(model.get('datePurchased')), false, 'Clicking the ordered button adds the date');
    contains(find(buttons.purchaseOrdered).attr('class'), 'active', 'Clicking the ordered button adds the active class');
  });
});


test('- Ordered button - Up', function() {
  expect(2);
  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('datePurchased', '1/1/2014');
  });
  click(buttons.purchaseOrdered);

  andThen(function(){
    equal(Ember.isEmpty(model.get('datePurchased')), true, 'Clicking the ordered button removes the date');
    notContains(find(buttons.purchaseOrdered).attr('class'), 'active', 'Clicking the ordered button removes the active class');
  });
});


test('- Cancelled button only appears when there is a buyer', function(){
  expect(4);
  var model = lookups.currentModel();

  isVisible(buttons.purchaseEditCancel, 'The cancelled button is visible');
  equal(find(buttons.purchaseEditCancel).prop('disabled'), true, 'The cancelled button is disabled');

  Ember.run(function(){
    model.set('buyer', { id: 123, name: 'test' });
  });

  andThen(function(){
    isVisible(buttons.purchaseEditCancel, 'The cancelled button is visible');
    equal(find(buttons.purchaseEditCancel).prop('disabled'), false, 'The cancelled button is not disabled');
  });
});


test('- Cancelled button - Down', function() {
  expect(2);
  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('buyer', { id: 123, name: 'test' });
  });

  click(buttons.purchaseEditCancel);

  andThen(function(){
    equal(Ember.isEmpty(model.get('dateCancelled')), false, 'Clicking the Cancelled button adds the date');
    contains(find(buttons.purchaseEditCancel).attr('class'), 'active', 'Clicking the Cancelled button adds the active class');
  });
});


test('- Cancelled button - Up', function() {
  expect(2);
  var model = lookups.currentModel();

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


test('- Deleted button only appears when not ordered', function(){
  expect(4);
  var model = lookups.currentModel();

  isVisible(buttons.purchaseEditDelete, 'The delete button is visible');
  equal(find(buttons.purchaseEditDelete).prop('disabled'), false, 'The delete button is not disabled');

  Ember.run(function(){
    model.set('datePurchased', '1/1/2014');
  });

  andThen(function(){
    isVisible(buttons.purchaseEditDelete, 'The delete button is visible');
    equal(find(buttons.purchaseEditDelete).prop('disabled'), true, 'The delete button is disabled');
  });
});


test('- Delete button deletes record and redirects', function(){
  expect(3);
  var model = lookups.currentModel();

  click(buttons.purchaseEditDelete);

  andThen(function(){
    equal(model.get('isDeleted'), true, 'Record is flagged as deleted');
    contains(myMocks.alertMessage, 'permanently delete this record', 'A confirmation dialog exists when you try to delete the record');
    equal(lookups.path(), 'purchases.tabs', 'After deleting the user is redirected to the main purchases list');
  });
});


test('- Star a record', function(){
  expect(2);
  var model = lookups.currentModel();

  click(buttons.purchaseEditStar);

  andThen(function(){
    equal(Ember.isEmpty(model.get('starred')), false, 'The record is starred');
    equal(model.get('isDirty'), true, 'The record is flagged as dirty');
  });
});


test('- Unstar a record', function(){
  expect(2);
  visit('/purchases/1/show');
  var model = lookups.currentModel();

  fixtures.updateTestFixtures(App.Purchase, { starred: '1/1/2014' });
  visit('/purchases/1/edit');

  click(buttons.purchaseEditStar);

  andThen(function(){
    equal(Ember.isEmpty(model.get('starred')), true, 'The record is unstarred');
    equal(model.get('isDirty'), true, 'The record is flagged as dirty');
  });
});


test('- Cancelled formatting', function(){
  expect(2);
  visit('/purchases/1/show');
  var model = lookups.currentModel();

  fixtures.updateTestFixtures(App.Purchase, { dateCancelled: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    var title = find('.edit_box>.title_bar');

    contains(title.attr('class'), 'is-cancelled', 'A cancelled record has the correct global class');
    contains(title.attr('class'), 'strikethrough', 'A cancelled record has the correct global class');
  });
});


test('- Reconciled formatting', function(){
  expect(1);
  visit('/purchases/1/show');
  var model = lookups.currentModel();

  fixtures.updateTestFixtures(App.Purchase, { dateReconciled: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    var title = find('.edit_box>.title_bar');

    contains(title.attr('class'), 'is-reconciled', 'A reconciled record has the correct global class');
  });
});


test('- Binding between model > courier', function(){
  expect(3);
  visit('/purchases/1/edit');

  var model = lookups.currentModel(),
      select = find(buttons.courierSelect);

  equal(model.get('courier'), null, 'The default value is empty');
  equal(select.val(), '', 'The default select is empty');

  Ember.run(function(){
    model.set('courier', 'OnTrac');
  });

  andThen(function(){
    equal(select.val(), 'OnTrac', 'The select is bound to the model');
  });
});


test('- Binding between courier > model', function(){
  expect(3);
  visit('/purchases/1/edit');

  var model = lookups.currentModel(),
      select = find(buttons.courierSelect);

  equal(model.get('courier'), null, 'The default value is empty');
  equal(select.val(), '', 'The default select is empty');

  change(select, 'OnTrac');

  andThen(function(){
    equal(model.get('courier'), 'OnTrac', 'The model is bound to the select');
  });
});


test('- Printing if record is Dirty', function() {
  expect(2);
  var model = lookups.currentModel();

  Ember.run(function() {
    model.send('becomeDirty');
  });

  click(buttons.purchaseEditPrint);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), true, 'There is an alert message');
    equal(myMocks.url, '/api/1.0/purchases/1', 'The correct url is sent');
  });
});


test('- Printing if record is not Dirty', function() {
  expect(2);
  var model = lookups.currentModel();

  click(buttons.purchaseEditPrint);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), false, 'There is not an alert message');
    equal(myMocks.url, '/api/1.0/purchases/1', 'The correct url is sent');
  });
});


test('- Saving if record is Dirty', function() {
  expect(2);
  var model = lookups.currentModel();

  Ember.run(function() {
    model.send('becomeDirty');
  });

  click(buttons.purchaseEditSavePDF);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), true, 'There is an alert message');
    equal(myMocks.url, '/api/1.0/purchases/1.pdf', 'The correct url is sent');
  });
});


test('- Saving if record is not Dirty', function() {
  expect(2);
  var model = lookups.currentModel();

  click(buttons.purchaseEditSavePDF);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), false, 'There is not an alert message');
    equal(myMocks.url, '/api/1.0/purchases/1.pdf', 'The correct url is sent');
  });
});


test('- Emailing if record is Dirty', function() {
  expect(1);
  var model = lookups.currentModel();

  Ember.run(function() {
    model.send('becomeDirty');
  });

  click(buttons.purchaseEditEmail);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), true, 'There is an alert message');
  });
});


test('- Emailing if record is not Dirty', function() {
  expect(1);
  var model = lookups.currentModel();

  click(buttons.purchaseEditEmail);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), false, 'There is not an alert message');
  });
});
