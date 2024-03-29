
module('Integration - Authorization - Tabs', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
  }
});


/*

test('As an employee', function() {
  expect(2);
  visit('/purchases/tabs?tab=Purchased').then(function() {

    var model = lookups.currentModel().get('firstObject');

    Ember.run(function() {
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.Session.currentUser.set('roles', ['employee']);
    });

    return click(buttons.firstRow);

  }).then(function() {

    notExists(buttons.actionControls, 'The action controls do not exist on New');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCanceled: null });

    return visit('/purchases/tabs?tab=Purchased');

  }).then(function() {

    notExists(buttons.actionControls, 'The action controls do not exist on Purchased');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(App.Globals.DATE_STRING),
                                       dateCanceled: null });

    return visit('/purchases/tabs?tab=Reconciled');

  }).then(function() {

    notExists(buttons.actionControls, 'The action controls do not exist on Reconciled');

  });
});


test('As a receiver', function() {
  expect(2);
  visit('/purchases/tabs?tab=Purchased').then(function() {

    var model = lookups.currentModel().get('firstObject');

    Ember.run(function() {
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.Session.currentUser.set('roles', ['receiver']);
    });

    return click(buttons.firstRow);

  }).then(function() {

    notExists(buttons.actionControls, 'The action controls do not exist on New');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                                buyer: { id: 15, name: 'A test buyer' },
                                                dateReconciled: null,
                                                dateCanceled: null });

    return visit('/purchases/tabs?tab=Purchased');

  }).then(function() {

    notExists(buttons.actionControls, 'The action controls do not exist on Purchased');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                                buyer: { id: 15, name: 'A test buyer' },
                                                dateReconciled: moment().format(App.Globals.DATE_STRING),
                                                dateCanceled: null });

    return visit('/purchases/tabs?tab=Reconciled');

  }).then(function() {

    notExists(buttons.actionControls, 'The action controls do not exist on Reconciled');

  });
});


test('As a Buyer', function() {
  expect(2);
  visit('/purchases/tabs?tab=Purchased').then(function() {

    var model = lookups.currentModel().get('firstObject');

    Ember.run(function() {
      App.Session.currentUser.set('roles', ['buyer']);
    });

    return click(buttons.firstRow);

  }).then(function() {

    exists(buttons.actionControls, 'The action controls exist on New');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                                buyer: { id: 15, name: 'A test buyer' },
                                                dateReconciled: null,
                                                dateCanceled: null });

    return visit('/purchases/tabs?tab=Purchased');

  }).then(function() {

    exists(buttons.actionControls, 'The action controls exist on Purchased');

    fixtures.updateAllFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                                buyer: { id: 15, name: 'A test buyer' },
                                                dateReconciled: moment().format(App.Globals.DATE_STRING),
                                                dateCanceled: null });

    return visit('/purchases/tabs?tab=Reconciled');

  }).then(function() {

    click(buttons.firstRow);
    exists(buttons.actionControls, 'The action controls exist on Reconciled');

  });
});

*/
