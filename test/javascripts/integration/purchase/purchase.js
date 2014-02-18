
module('Integration - Purchase - Main', {
  setup: function() {

    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {
  }

});


test('Route name is purchase.edit', function(){
  expect(1);

  equal(lookups.path(), 'purchase.edit', 'lookups.path is set to purchase.edit');
});


test('Route name is purchase.show', function(){
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


test('Clicking edit button transitions to edit', function(){
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
test('Claim a record', function() {
  expect(4);
  var cur_user = lookups.currentModel().get('buyer');

  equal(cur_user, null, 'Current record is not assigned');

  click(buttons.purchaseClaim);

  andThen(function(){
    equal(myMocks.ajaxParams.url, App.getUrl('/purchases/assign'), 'It sends an ajax request to assign the user');
    ok(!Ember.isEmpty(myMocks.ajaxParams.data.user_id), 'It sends the userss ID');
    equal(myMocks.ajaxParams.data.ids[0], '1', 'It sends the purchase ID as an array');
  });
});


test('Unclaim a record', function() {
  expect(3);

  fixtures.updateAllFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show'); // Best way to refresh the route with new data

  click(buttons.purchaseUnclaim);

  andThen(function(){
    equal(myMocks.ajaxParams.url, App.getUrl('/purchases/assign'), 'It sends an ajax request to unassign the user');
    equal(myMocks.ajaxParams.data.user_id, null, 'It sends null for the user ID');
    equal(myMocks.ajaxParams.data.ids[0], '1', 'It sends the purchase ID as an array');
  });
});
*/

test('Date requested validation - Empty', function(){
  expect(1);
  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('dateRequested', null);
  });

  andThen(function(){
    contains(find(buttons.dateRequestedField).attr('class'), 'has-error', 'An empty date-requested is error');
  });
});


test('Date requested validation - Not-empty', function(){
  expect(1);
  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('dateRequested', 'Jan 1, 2014');
  });

  andThen(function(){
    equal(find(buttons.dateRequestedField).attr('class'), '', 'A non-empty date-requested is not error');
  });
});


test('Ordered button - Down', function() {
  expect(2);
  var model = lookups.currentModel();

  click(buttons.purchaseOrdered);

  andThen(function(){
    equal(Ember.isEmpty(model.get('datePurchased')), false, 'Clicking the ordered button adds the date');
    contains(find(buttons.purchaseOrdered).attr('class'), 'active', 'Clicking the ordered button adds the active class');
  });
});


test('Ordered button - Up', function() {
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


test('Star a record', function(){
  expect(2);
  var model = lookups.currentModel();

  click(buttons.purchaseEditStar);

  andThen(function(){
    equal(Ember.isEmpty(model.get('starred')), false, 'The record is starred');
    equal(model.get('isDirty'), true, 'The record is flagged as dirty');
  });
});


test('Unstar a record', function(){
  expect(2);
  var model = lookups.currentModel();
  fixtures.updateOneFixture(App.Purchase, 1, { starred: '1/1/2014' });

  click(buttons.purchaseEditStar);

  andThen(function(){
    equal(Ember.isEmpty(model.get('starred')), true, 'The record is unstarred');
    equal(model.get('isDirty'), true, 'The record is flagged as dirty');
  });
});


test('Canceled formatting', function(){
  expect(2);
  var model = lookups.currentModel();

  fixtures.updateOneFixture(App.Purchase, 1, { dateCanceled: '1/1/2014' });
  andThen(function(){
    var title = find(buttons.purchaseHeader);

    contains(title.attr('class'), 'is-canceled', 'A canceled record has the correct global class');
    contains(title.attr('class'), 'strikethrough', 'A canceled record has the correct global class');
  });
});


test('Reconciled formatting', function(){
  expect(1);
  var model = lookups.currentModel();

  fixtures.updateOneFixture(App.Purchase, 1, { dateReconciled: '1/1/2014' });

  andThen(function(){
    var title = find('.edit_box>.title_bar');

    contains(title.attr('class'), 'is-reconciled', 'A reconciled record has the correct global class');
  });
});


test('Binding between model > courier', function(){
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


test('Binding between courier > model', function(){
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
