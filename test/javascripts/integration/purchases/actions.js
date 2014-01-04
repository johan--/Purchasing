
module('Purchases-Actions', {
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

test('-Can assign records', function(){

  visit('/purchases?tab=New').then(function(){

    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    // Includes assign button
    ok(exists(buttons.actionAssignComplete), 'Clicking a record should show assign button');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Clicking a record should show select all button');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Clicking a record should show select none button');


  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '1', 'Clicking a record should show a total of 1');

    return click(find(buttons.purchaseClickableRows)[0]);

  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '2', 'Clicking another record should show a total of 2');

    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    contains(find(buttons.actionAssignComplete).text(), '1', 'Clicking original record a second time should show a total of 1');

    helperMethods.controller('purchases').set('assignBuyer', 5); // Fake

    return click(buttons.actionAssignComplete);

  }).then(function(){
    equal(mockResults.ajaxParams.url, '/purchases/assign', 'Assigning calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');
    equal(mockResults.ajaxParams.data.ids[0], '1', 'Assigning send an array of IDs');
  });
});

test('-Can reconcile records', function(){

  updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                     buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?tab=Purchased').then(function(){

    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){
    // Includes reconcile button
    ok(exists(buttons.actionReconcileComplete), 'Clicking a record should show reconcile button');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Clicking a record should show select all button');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Clicking a record should show select none button');

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

  updateTestFixtures(App.Purchase, { datePurchased: moment().format(APP_DATE_STRING),
                                     dateReconciled: moment().format(APP_DATE_STRING),
                                     buyer: { id: 15, name: 'A test buyer' } });

  visit('/purchases?tab=Reconciled').then(function(){
    // click a record
    return click(find(buttons.purchaseClickableRows)[1]);

  }).then(function(){

    // Includes unreconcile button
    ok(exists(buttons.actionUnreconcileComplete), 'Clicking a record should show unreconciling button');
    // Includes select all
    ok(exists(buttons.actionCheckAll), 'Clicking a record should show select all button');
    // Includes select none
    ok(exists(buttons.actionCheckNone), 'Clicking a record should show select none button');

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
  visit('/purchases?tab=New').then(function(){
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


