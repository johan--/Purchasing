
module('Authorization - Purchase.Show', {
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


test('- As a employee', function() {
  expect(17);
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.current_user.set('roles', ['employee']);
    });

  }).then(function(){

    notExists(find(buttons.purchaseEditStarClickable), 'The star is not clickable');

    notExists(find(buttons.purchaseEditAttachments), 'The attachments button does not exist');
    exists(find(buttons.purchaseEditSavePDF), 'The save PDF button does exist');
    exists(find(buttons.purchaseEditPrint), 'The Print button does exist');
    notExists(find(buttons.purchaseEditEmail), 'The Email button does not exist');

    notExists(find(buttons.purchaseClaim), 'The Claim button does not exist');

    notExists(find(buttons.purchasePersonNameToken), 'The person token does not exist');
    notExists(find(buttons.purchasePersonTokenDelete), 'The person token delete does not exist');

    notExists(find(buttons.purchaseStartEdit), 'The edit button does not exist');
    notExists(find(buttons.purchaseOrdered), 'The ordered button does not exist');
    notExists(find(buttons.purchaseEditDelete), 'The Delete button does not exist');
    notExists(find(buttons.purchaseEditCancel), 'The Cancel button does not exist');

    notExists(find(buttons.receivingNew), 'The New Receiving button does not exist');
    notExists(find(buttons.receiveAll), 'The Receive All button does not exist');

    notExists(find(buttons.accountingTaxRate), 'The Tax Rate button does not exist');
    notExists(find(buttons.accountCurrentNumber), 'The Account # button does not exist');

    notExists(find(buttons.tagsSelect), 'The Tag Select button does not exist');

  });
});


test('- As a receiver', function() {
  expect(17);
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      App.current_user.set('roles', ['receiver']);
    });

  }).then(function(){

    notExists(find(buttons.purchaseEditStarClickable), 'The star is not clickable');

    exists(find(buttons.purchaseEditAttachments), 'The attachments button does exist');
    exists(find(buttons.purchaseEditSavePDF), 'The save PDF button does exist');
    exists(find(buttons.purchaseEditPrint), 'The Print button does exist');
    notExists(find(buttons.purchaseEditEmail), 'The Email button does not exist');

    notExists(find(buttons.purchaseClaim), 'The Claim button does not exist');

    notExists(find(buttons.purchasePersonNameToken), 'The person token does not exist');
    notExists(find(buttons.purchasePersonTokenDelete), 'The person token delete does not exist');

    notExists(find(buttons.purchaseStartEdit), 'The edit button does not exist');
    notExists(find(buttons.purchaseOrdered), 'The ordered button does not exist');
    notExists(find(buttons.purchaseEditDelete), 'The Delete button does not exist');
    notExists(find(buttons.purchaseEditCancel), 'The Cancel button does not exist');

    exists(find(buttons.receivingNew), 'The New Receiving button does exist');
    exists(find(buttons.receiveAll), 'The Receive All button does exist');

    notExists(find(buttons.accountingTaxRate), 'The Tax Rate button does not exist');
    notExists(find(buttons.accountCurrentNumber), 'The Account # button does not exist');

    notExists(find(buttons.tagsSelect), 'The Tag Select button does not exist');

  });
});


test('- As a buyer', function() {
  expect(17);
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

  }).then(function(){

    notExists(find(buttons.purchaseEditStarClickable), 'The star is not clickable');

    exists(find(buttons.purchaseEditAttachments), 'The attachments button does exist');
    exists(find(buttons.purchaseEditSavePDF), 'The save PDF button does exist');
    exists(find(buttons.purchaseEditPrint), 'The Print button does exist');
    exists(find(buttons.purchaseEditEmail), 'The Email button does exist');

    exists(find(buttons.purchaseClaim), 'The Claim button does exist');

    notExists(find(buttons.purchasePersonNameToken), 'The person token does not exist');
    notExists(find(buttons.purchasePersonTokenDelete), 'The person token delete does not exist');

    exists(find(buttons.purchaseStartEdit), 'The edit button does exist');
    notExists(find(buttons.purchaseOrdered), 'The ordered button does not exist');
    exists(find(buttons.purchaseEditDelete), 'The Delete button does exist');
    notExists(find(buttons.purchaseEditCancel), 'The Cancel button does not exist');

    notExists(find(buttons.receivingNew), 'The New Receiving button does not exist');
    notExists(find(buttons.receiveAll), 'The Receive All button does not exist');

    notExists(find(buttons.accountingTaxRate), 'The Tax Rate button does not exist');
    notExists(find(buttons.accountCurrentNumber), 'The Account # button does not exist');

    notExists(find(buttons.tagsSelect), 'The Tag Select button does not exist');

  });
});


test('- isDirty As an employee', function() {
  expect(1);
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      App.current_user.set('roles', ['employee']);
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      model.send('becomeDirty');
    });

  }).then(function(){

    notExists(find(buttons.purchaseSave), 'The save button does not exist');

  });
});


test('- isDirty As a receiver', function() {
  expect(1);
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
      model.set('can_update', null);
      model.set('can_create', null);
      model.set('can_delete', null);
      model.send('becomeDirty');
    });

  }).then(function(){

    notExists(find(buttons.purchaseSave), 'The save button does not exist');

  });
});


test('- isDirty As a buyer', function() {
  expect(1);
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
      model.send('becomeDirty');
    });

  }).then(function(){

    exists(find(buttons.purchaseSave), 'The save button does exist');

  });
});


test('- Unclaim as an employee', function(){
  expect(1);

  updateTestFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      App.current_user.set('roles', ['employee']);
    });

  }).then(function(){

    notExists(find(buttons.purchaseUnclaim), 'The unclaim button does not exist');

  });
});


test('- Unclaim as a receiver', function(){
  expect(1);

  updateTestFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

  }).then(function(){

    notExists(find(buttons.purchaseUnclaim), 'The unclaim button does not exist');

  });
});


test('- Unclaim as a buyer', function(){
  expect(1);

  updateTestFixtures(App.Purchase, { buyer: { name: 'A Test Buyer', id: '5' } });
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();

    Ember.run(function(){
      App.current_user.set('roles', ['buyer']);
    });

  }).then(function(){

    exists(find(buttons.purchaseUnclaim), 'The unclaim button does exist');

  });
});


test('- Receiving hover as an employee', function(){
  expect(2);
  visit('/purchases/1/show').then(function(){

    var line = helperMethods.createLine(),
        receiving = helperMethods.createReceiving(line);

    Ember.run(function(){
      receiving.set('can_update', null);
      receiving.set('can_create', null);
      receiving.set('can_delete', null);
      App.current_user.set('roles', ['employee']);
    });

    return wait();

  }).then(function(){

    notExists(find(buttons.receivingEdit), 'The receiving edit button does not exist');
    notExists(find(buttons.receivingDelete), 'The receiving delete button does not exist');

  });
});


test('- Receiving hover as a receiver', function(){
  expect(2);
  visit('/purchases/1/show').then(function(){

    var line = helperMethods.createLine(),
        receiving = helperMethods.createReceiving(line);

    Ember.run(function(){
      App.current_user.set('roles', ['receiver']);
    });

    return wait();

  }).then(function(){

    exists(find(buttons.receivingEdit), 'The receiving edit button does exist');
    exists(find(buttons.receivingDelete), 'The receiving delete button does exist');

  });
});


test('- Receiving hover as a buyer', function(){
  expect(2);
  visit('/purchases/1/show').then(function(){

    var line = helperMethods.createLine(),
        receiving = helperMethods.createReceiving(line);

    Ember.run(function(){
      receiving.set('can_update', null);
      receiving.set('can_create', null);
      receiving.set('can_delete', null);
      App.current_user.set('roles', ['buyer']);
    });

    return wait();

  }).then(function(){

    notExists(find(buttons.receivingEdit), 'The receiving edit button does not exist');
    notExists(find(buttons.receivingDelete), 'The receiving delete button does not exist');

  });
});


test('- Receiving click as an employee', function(){
  expect(5);
  visit('/purchases/1/show').then(function(){

    var line = helperMethods.createLine(),
        receiving = helperMethods.createReceiving(line);

    Ember.run(function(){
      receiving.set('can_update', null);
      receiving.set('can_create', null);
      receiving.set('can_delete', null);
      receiving.send('becomeDirty');
      App.current_user.set('roles', ['employee']);
    });

    return wait();

  }).then(function(){

    notExists(find(buttons.receivingButtons), 'The receiving buttons do not exist');
    notExists(find(buttons.receivingMinus), 'The receiving minus button does not exist');
    notExists(find(buttons.receivingPlus), 'The receiving plus button does not exist');
    notExists(find(buttons.receivingRecCancel), 'The receiving cancel button does not exist');
    notExists(find(buttons.receivingRecSave), 'The receiving plus button does not exist');

  });
});


test('- Receiving click as a receiver', function(){
  expect(5);
  visit('/purchases/1/show').then(function(){

    var line = helperMethods.createLine(),
        receiving = helperMethods.createReceiving(line);

    Ember.run(function(){
      receiving.send('becomeDirty');
      App.current_user.set('roles', ['receiver']);
    });

    return click(find(buttons.receivingEdit)[0]);

  }).then(function(){

    exists(find(buttons.receivingButtons), 'The receiving buttons do exist');
    exists(find(buttons.receivingMinus), 'The receiving minus button does exist');
    exists(find(buttons.receivingPlus), 'The receiving plus button does exist');
    exists(find(buttons.receivingRecCancel), 'The receiving cancel button does exist');
    exists(find(buttons.receivingRecSave), 'The receiving plus button does exist');

  });
});


test('- Receiving click as a buyer', function(){
  expect(5);
  visit('/purchases/1/show').then(function(){

    var line = helperMethods.createLine(),
        receiving = helperMethods.createReceiving(line);

    Ember.run(function(){
      receiving.set('can_update', null);
      receiving.set('can_create', null);
      receiving.set('can_delete', null);
      receiving.send('becomeDirty');
      App.current_user.set('roles', ['buyer']);
    });

    return wait();

  }).then(function(){

    notExists(find(buttons.receivingButtons), 'The receiving buttons do not exist');
    notExists(find(buttons.receivingMinus), 'The receiving minus button does not exist');
    notExists(find(buttons.receivingPlus), 'The receiving plus button does not exist');
    notExists(find(buttons.receivingRecCancel), 'The receiving cancel button does not exist');
    notExists(find(buttons.receivingRecSave), 'The receiving plus button does not exist');

  });
});
