
module('Authorization - Tabs', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {

  }
});


test('As an employee', function(){
  expect(3);
  visit('/purchases/tabs?tab=New').then(function(){

    var model = currentModel().get('firstObject');

    Ember.run(function(){
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.current_user.set('roles', ['employee']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    notExists(buttons.actionControls, 'The action controls do not exist');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCancelled: null });

    return visit('/purchases/tabs?tab=Purchased');

  }).then(function(){

    notExists(buttons.actionControls, 'The action controls do not exist');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(App.Globals.DATE_STRING),
                                       dateCancelled: null });

    return visit('/purchases/tabs?tab=Reconciled');

  }).then(function(){

    notExists(buttons.actionControls, 'The action controls do not exist');

  });
});


test('As a receiver', function(){
  expect(3);
  visit('/purchases/tabs?tab=New').then(function(){

    var model = currentModel().get('firstObject');

    Ember.run(function(){
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.current_user.set('roles', ['receiver']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    notExists(buttons.actionControls, 'The action controls do not exist');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCancelled: null });

    return visit('/purchases/tabs?tab=Purchased');

  }).then(function(){

    notExists(buttons.actionControls, 'The action controls do not exist');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(App.Globals.DATE_STRING),
                                       dateCancelled: null });

    return visit('/purchases/tabs?tab=Reconciled');

  }).then(function(){

    notExists(buttons.actionControls, 'The action controls do not exist');

  });
});


test('As a Buyer', function(){
  expect(3);
  visit('/purchases/tabs?tab=New').then(function(){

    var model = currentModel().get('firstObject');

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    exists(buttons.actionControls, 'The action controls exist');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: null,
                                       dateCancelled: null });

    return visit('/purchases/tabs?tab=Purchased');

  }).then(function(){

    exists(buttons.actionControls, 'The action controls exist');

    updateTestFixtures(App.Purchase, { datePurchased: moment().format(App.Globals.DATE_STRING),
                                       buyer: { id: 15, name: 'A test buyer' },
                                       dateReconciled: moment().format(App.Globals.DATE_STRING),
                                       dateCancelled: null });

    return visit('/purchases/tabs?tab=Reconciled');

  }).then(function(){

    exists(buttons.actionControls, 'The action controls exist');

  });
});
