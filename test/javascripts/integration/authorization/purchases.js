
module('Authorization - Purchases', {
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


test('As an employee', function(){
  expect(6);
  visit('/purchases/tabs?purchases.tabs[tab]=New').then(function(){

    var model = helperMethods.model().get('firstObject');

    Ember.run(function(){
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.current_user.set('roles', ['employee']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    notExists(buttons.newButton, 'The New button does not exist');

    notExists(find(buttons.firstRow).find(buttons.purchaseEditStarClickable), 'The star button is not clickable');
    exists(find(buttons.firstRow).find(buttons.purchaseSelect), 'The select button exists');
    exists(find(buttons.firstRow).find(buttons.purchaseShow), 'The show button exists');
    notExists(find(buttons.firstRow).find(buttons.purchaseEdit), 'The edit button does not exist');
    notExists(find(buttons.firstRow).find(buttons.purchaseDelete), 'The delete button does not exist');

  });
});


test('As a receiver', function(){
  expect(6);
  visit('/purchases/tabs?purchases.tabs[tab]=New').then(function(){

    var model = helperMethods.model().get('firstObject');

    Ember.run(function(){
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.current_user.set('roles', ['receiver']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    notExists(buttons.newButton, 'The New button does not exist');

    notExists(find(buttons.firstRow).find(buttons.purchaseEditStarClickable), 'The star button is not clickable');
    exists(find(buttons.firstRow).find(buttons.purchaseSelect), 'The select button exists');
    exists(find(buttons.firstRow).find(buttons.purchaseShow), 'The show button exists');
    notExists(find(buttons.firstRow).find(buttons.purchaseEdit), 'The edit button does not exist');
    notExists(find(buttons.firstRow).find(buttons.purchaseDelete), 'The delete button does not exist');
  });
});


test('As a Buyer', function(){
  expect(6);
  visit('/purchases/tabs?purchases.tabs[tab]=New').then(function(){

    var model = helperMethods.model().get('firstObject');

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

    return click(buttons.firstRow);

  }).then(function(){

    exists(buttons.newButton, 'The New button does exist');

    exists(find(buttons.firstRow).find(buttons.purchaseEditStarClickable), 'The star button is clickable');
    exists(find(buttons.firstRow).find(buttons.purchaseSelect), 'The select button exists');
    exists(find(buttons.firstRow).find(buttons.purchaseShow), 'The show button exists');
    exists(find(buttons.firstRow).find(buttons.purchaseEdit), 'The edit button exists');
    exists(find(buttons.firstRow).find(buttons.purchaseDelete), 'The delete button exists');
  });
});
