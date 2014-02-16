
module('Integration - Authorization - Purchase', {
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


test('As a employee', function() {
  expect(17);
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.current_user.set('roles', ['employee']);
    });

  }).then(function(){

    notExists(buttons.purchaseEditStarClickable, 'The star is not clickable');

    notExists(buttons.purchaseEditAttachments, 'The attachments button does not exist');
    exists(buttons.purchaseEditSavePDF, 'The save PDF button does exist');
    exists(buttons.purchaseEditPrint, 'The Print button does exist');
    notExists(buttons.purchaseEditEmail, 'The Email button does not exist');

    notExists(buttons.purchaseClaim, 'The Claim button does not exist');

    notExists(buttons.purchasePersonNameToken, 'The person token does not exist');
    notExists(buttons.purchasePersonTokenDelete, 'The person token delete does not exist');

    notExists(buttons.purchaseStartEdit, 'The edit button does not exist');
    notExists(buttons.purchaseOrdered, 'The ordered button does not exist');
    notExists(buttons.purchaseEditDelete, 'The Delete button does not exist');
    notExists(buttons.purchaseEditCancel, 'The Cancel button does not exist');

    notExists(buttons.receivingNew, 'The New Receiving button does not exist');
    notExists(buttons.receiveAll, 'The Receive All button does not exist');

    notExists(buttons.accountingTaxRate, 'The Tax Rate button does not exist');
    notExists(buttons.accountCurrentNumber, 'The Account # button does not exist');

    notExists(buttons.tagsSelect, 'The Tag Select button does not exist');

  });
});


test('As a receiver', function() {
  expect(17);
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.current_user.set('roles', ['receiver']);
    });

  }).then(function(){

    notExists(buttons.purchaseEditStarClickable, 'The star is not clickable');

    exists(buttons.purchaseEditAttachments, 'The attachments button does exist');
    exists(buttons.purchaseEditSavePDF, 'The save PDF button does exist');
    exists(buttons.purchaseEditPrint, 'The Print button does exist');
    notExists(buttons.purchaseEditEmail, 'The Email button does not exist');

    notExists(buttons.purchaseClaim, 'The Claim button does not exist');

    notExists(buttons.purchasePersonNameToken, 'The person token does not exist');
    notExists(buttons.purchasePersonTokenDelete, 'The person token delete does not exist');

    notExists(buttons.purchaseStartEdit, 'The edit button does not exist');
    notExists(buttons.purchaseOrdered, 'The ordered button does not exist');
    notExists(buttons.purchaseEditDelete, 'The Delete button does not exist');
    notExists(buttons.purchaseEditCancel, 'The Cancel button does not exist');

    exists(buttons.receivingNew, 'The New Receiving button does exist');
    exists(buttons.receiveAll, 'The Receive All button does exist');

    notExists(buttons.accountingTaxRate, 'The Tax Rate button does not exist');
    notExists(buttons.accountCurrentNumber, 'The Account # button does not exist');

    notExists(buttons.tagsSelect, 'The Tag Select button does not exist');

  });
});


test('As a buyer', function() {
  expect(16);
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

  }).then(function(){

    notExists(buttons.purchaseEditStarClickable, 'The star is not clickable');

    exists(buttons.purchaseEditAttachments, 'The attachments button does exist');
    exists(buttons.purchaseEditSavePDF, 'The save PDF button does exist');
    exists(buttons.purchaseEditPrint, 'The Print button does exist');
    exists(buttons.purchaseEditEmail, 'The Email button does exist');

    //exists(buttons.purchaseClaim, 'The Claim button does exist');

    notExists(buttons.purchasePersonNameToken, 'The person token does not exist');
    notExists(buttons.purchasePersonTokenDelete, 'The person token delete does not exist');

    exists(buttons.purchaseStartEdit, 'The edit button does exist');
    notExists(buttons.purchaseOrdered, 'The ordered button does not exist');
    exists(buttons.purchaseEditDelete, 'The Delete button does exist');
    exists(buttons.purchaseEditCancel, 'The Cancel button does not exist');

    notExists(buttons.receivingNew, 'The New Receiving button does not exist');
    notExists(buttons.receiveAll, 'The Receive All button does not exist');

    notExists(buttons.accountingTaxRate, 'The Tax Rate button does not exist');
    notExists(buttons.accountCurrentNumber, 'The Account # button does not exist');

    notExists(buttons.tagsSelect, 'The Tag Select button does not exist');

  });
});


test('isDirty As an employee', function() {
  expect(1);
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      App.current_user.set('roles', ['employee']);
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      model.send('becomeDirty');
    });

  }).then(function(){

    notExists(buttons.purchaseSave, 'The save button does not exist');

  });
});


test('isDirty As a receiver', function() {
  expect(1);
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      model.send('becomeDirty');
    });

  }).then(function(){

    notExists(buttons.purchaseSave, 'The save button does not exist');

  });
});


test('isDirty As a buyer', function() {
  expect(1);
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
      model.send('becomeDirty');
    });

  }).then(function(){

    notExists(buttons.purchaseSave, 'The save button does not exist');

  });
});


test('Unclaim as an employee', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      App.current_user.set('roles', ['employee']);
    });

  }).then(function(){

    notExists(buttons.purchaseUnclaim, 'The unclaim button does not exist');

  });
});


test('Unclaim as a receiver', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

  }).then(function(){

    notExists(buttons.purchaseUnclaim, 'The unclaim button does not exist');

  });
});

/*
test('Unclaim as a buyer', function(){
  expect(1);

  fixtures.updateAllFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show').then(function(){

    var model = lookups.currentModel();

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

  }).then(function(){

    exists(buttons.purchaseUnclaim), 'The unclaim button does exist');

  });
});*/


test('Receiving hover as an employee', function(){
  expect(1);
  visit('/purchases/1/show').then(function(){

    var line = fixtures.createLine(),
        receiving = fixtures.createReceiving(line);

    Ember.run(function(){
      receiving.set('can_update', null);
      receiving.set('can_create', null);
      receiving.set('can_delete', null);
      App.current_user.set('roles', ['employee']);
    });

    return wait();

  }).then(function(){

    notExists(buttons.receivingDelete, 'The receiving delete button does not exist');

  });
});


test('Receiving hover as a receiver', function(){
  expect(1);
  visit('/purchases/1/show').then(function(){

    var line = fixtures.createLine(),
        receiving = fixtures.createReceiving(line);

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

    return wait();

  }).then(function(){

    exists(buttons.receivingDelete, 'The receiving delete button does exist');

  });
});


test('Receiving hover as a buyer', function(){
  expect(1);
  visit('/purchases/1/show').then(function(){

    var line = fixtures.createLine(),
        receiving = fixtures.createReceiving(line);

    Ember.run(function(){
      receiving.set('can_update', null);
      receiving.set('can_create', null);
      receiving.set('can_delete', null);
      App.current_user.set('roles', ['buyer']);
    });

    return wait();

  }).then(function(){

    notExists(buttons.receivingDelete, 'The receiving delete button does not exist');

  });
});


test('Receiving click as an employee', function(){
  expect(5);
  visit('/purchases/1/show').then(function(){

    var line = fixtures.createLine(),
        receiving = fixtures.createReceiving(line);

    Ember.run(function(){
      receiving.set('can_update', null);
      receiving.set('can_create', null);
      receiving.set('can_delete', null);
      receiving.send('becomeDirty');
      App.current_user.set('roles', ['employee']);
    });

    return wait();

  }).then(function(){

    notExists(buttons.receivingButtons, 'The receiving buttons do not exist');
    notExists(buttons.receivingMinus, 'The receiving minus button does not exist');
    notExists(buttons.receivingPlus, 'The receiving plus button does not exist');
    notExists(buttons.receivingRecCancel, 'The receiving cancel button does not exist');
    notExists(buttons.receivingRecSave, 'The receiving plus button does not exist');

  });
});


test('Receiving click as a receiver', function(){
  expect(5);
  var receiving = null;

  visit('/purchases/1/show').then(function(){

    var line = fixtures.createLine();
    receiving = fixtures.createReceiving(line);

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

    click(find(buttons.receivingEdit)[0]);

    Ember.run(function(){
      receiving.send('becomeDirty');
    });

    return wait();

  }).then(function(){
    exists(buttons.receivingButtons, 'The receiving buttons do exist');
    exists(buttons.receivingMinus, 'The receiving minus button does exist');
    exists(buttons.receivingPlus, 'The receiving plus button does exist');
    exists(buttons.receivingRecCancel, 'The receiving cancel button does exist');
    exists(buttons.receivingRecSave, 'The receiving save button does exist');

  });
});


test('Receiving click as a buyer', function(){
  expect(5);
  visit('/purchases/1/show').then(function(){

    var line = fixtures.createLine(),
        receiving = fixtures.createReceiving(line);

    Ember.run(function(){
      receiving.set('can_update', null);
      receiving.set('can_create', null);
      receiving.set('can_delete', null);
      receiving.send('becomeDirty');
      App.current_user.set('roles', ['buyer']);
    });

    return wait();

  }).then(function(){

    notExists(buttons.receivingButtons, 'The receiving buttons do not exist');
    notExists(buttons.receivingMinus, 'The receiving minus button does not exist');
    notExists(buttons.receivingPlus, 'The receiving plus button does not exist');
    notExists(buttons.receivingRecCancel, 'The receiving cancel button does not exist');
    notExists(buttons.receivingRecSave, 'The receiving plus button does not exist');

  });
});
