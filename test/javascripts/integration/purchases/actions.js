
module('Purchases-Actions', {
  setup: function() {
    mockResults.clearMockResults();

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
  }
});


test('-Can assign records', function(){
  expect(11);
  var buyers = META_FIXTURE_BASE.buyers;

  visit('/purchases?purchases.tabs[tab]=New').then(function(){

    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    // Includes assign button
    exists(buttons.actionAssignComplete, 'Clicking a record should show assign button');
    // Includes select all
    exists(buttons.actionCheckAll, 'Clicking a record should show select all button');
    // Includes select none
    exists(buttons.actionCheckNone, 'Clicking a record should show select none button');

    contains(find(buttons.actionAssignComplete).text(), '1', 'Clicking a record should show a total of 1');

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '2', 'Clicking another record should show a total of 2');

    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    var controller = helperMethods.controller('purchases');

    contains(find(buttons.actionAssignComplete).text(), '1', 'Clicking original record a second time should show a total of 1');

    change(buttons.assignSelect, buyers[0].id);
    equal(controller.get('assignBuyer'), buyers[0].id, 'Changing the select updates the controller');

    return click(buttons.actionAssignComplete);

  }).then(function(){
    equal(mockResults.ajaxParams.url, '/purchases/assign', 'Assigning calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'Assigning send an array of IDs');
    equal(mockResults.ajaxParams.data.user_id, buyers[0].id, 'Assigning sends the buyer ID');
  });
});


test('-Can reconcile records', function(){
  expect(10);
  updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                     buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?purchases.tabs[tab]=Purchased').then(function(){

    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    // Includes reconcile button
    exists(buttons.actionReconcileComplete, 'Clicking a record should show reconcile button');
    // Includes select all
    exists(buttons.actionCheckAll, 'Clicking a record should show select all button');
    // Includes select none
    exists(buttons.actionCheckNone, 'Clicking a record should show select none button');

    contains(find(buttons.actionReconcileComplete).text(), '1', 'Clicking a record should show a total of 1');

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    contains(find(buttons.actionReconcileComplete).text(), '2', 'Clicking another record should show a total of 2');

    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    contains(find(buttons.actionReconcileComplete).text(), '1', 'Clicking original record a second time should show a total of 1');

    return click(buttons.actionReconcileComplete);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/reconcile', 'Assigning calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'Assigning send an array of IDs');
    equal(mockResults.ajaxParams.data.value, true, 'Assigning sends assign value of true');
  });
});


test('-Can unreconcile records', function(){
  expect(10);
  updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                     dateReconciled: moment().format(App.Globals.DATE_STRING),
                                     buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?purchases.tabs[tab]=Reconciled').then(function(){
    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){

    // Includes unreconcile button
    exists(buttons.actionUnreconcileComplete, 'Clicking a record should show unreconciling button');
    // Includes select all
    exists(buttons.actionCheckAll, 'Clicking a record should show select all button');
    // Includes select none
    exists(buttons.actionCheckNone, 'Clicking a record should show select none button');

    contains(find(buttons.actionUnreconcileComplete).text(), '1', 'Clicking a record should show a total of 1');

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    contains(find(buttons.actionUnreconcileComplete).text(), '2', 'Clicking another record should show a total of 2');

    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    contains(find(buttons.actionUnreconcileComplete).text(), '1', 'Clicking original record a second time should show a total of 1');

    return click(buttons.actionUnreconcileComplete);

  }).then(function(){
    equal(mockResults.ajaxParams.url, '/purchases/reconcile', 'Assigning calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'Assigning send an array of IDs');
    equal(mockResults.ajaxParams.data.value, false, 'Assigning sends assign value of false');
  });
});


test('-Action buttons', function(){
  expect(2);
  visit('/purchases?purchases.tabs[tab]=New').then(function(){
    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    return click(buttons.actionCheckAll);

  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '5', 'Select all should result in 5 records selected');

    return click(buttons.actionCheckNone);

  }).then(function(){
    equal(find(buttons.actionAssignComplete).length, 0, 'Select none should result in removing complete button');
    // TODO test controller for 0 selected?

  });
});


test('Assign actions appear on New Tab', function(){
  expect(3);
  visit('/purchases?purchases.tabs[tab]=New').then(function(){

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    isVisible(buttons.actionAssignComplete, 'Assign buttons are visible');
    isHidden(buttons.actionReconcileComplete, 'Reconcile buttons are not visible');
    isHidden(buttons.actionUnreconcileComplete, 'Unreconcile buttons are not visible');
  });
});


test('No actions appear on Pending tab', function(){
  expect(3);
  updateTestFixtures(App.Purchase, { buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?purchases.tabs[tab]=Pending').then(function(){

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    isHidden(buttons.actionAssignComplete, 'Assign buttons are not visible');
    isHidden(buttons.actionReconcileComplete, 'Reconcile buttons are not visible');
    isHidden(buttons.actionUnreconcileComplete, 'Unreconcile buttons are not visible');
  });
});


test('Reconcile actions only appear on Purchased Tab', function(){
  expect(3);
  updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                     buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?purchases.tabs[tab]=Purchased').then(function(){

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    isHidden(buttons.actionAssignComplete, 'Assign buttons are not visible');
    isVisible(buttons.actionReconcileComplete, 'Reconcile buttons are visible');
    isHidden(buttons.actionUnreconcileComplete, 'Unreconcile buttons are not visible');
  });
});


test('Unreconcile actions only appear on Reconciled Tab', function(){
  expect(3);
  updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                     dateReconciled: moment().format(App.Globals.DATE_STRING),
                                     buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?purchases.tabs[tab]=Reconciled').then(function(){

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    isHidden(buttons.actionAssignComplete, 'Assign buttons are not visible');
    isHidden(buttons.actionReconcileComplete, 'Reconcile buttons are not visible');
    isVisible(buttons.actionUnreconcileComplete, 'Unreconcile buttons are visible');
  });
});


test('No actions appear on Cancelled Tab', function(){
  expect(3);
  updateTestFixtures(App.Purchase, { dateCancelled: moment().format(App.Globals.DATE_STRING) });

  visit('/purchases?purchases.tabs[tab]=Cancelled').then(function(){

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    isHidden(buttons.actionAssignComplete, 'Assign buttons are not visible');
    isHidden(buttons.actionReconcileComplete, 'Reconcile buttons are not visible');
    isHidden(buttons.actionUnreconcileComplete, 'Unreconcile buttons are not visible');
  });
});

test('No actions appear on Starred Tab', function(){
  expect(3);
  updateTestFixtures(App.Purchase, { starred: moment().format(App.Globals.DATE_STRING) });

  visit('/purchases?purchases.tabs[tab]=Starred').then(function(){

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    isHidden(buttons.actionAssignComplete, 'Assign buttons are not visible');
    isHidden(buttons.actionReconcileComplete, 'Reconcile buttons are not visible');
    isHidden(buttons.actionUnreconcileComplete, 'Unreconcile buttons are not visible');
  });
});
