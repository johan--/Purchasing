(function() {

module('Integration - Users - Users', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/users');
  },

  teardown: function() {
  }
});


test('Open modal', function() {
  expect(2);
  buildAccounts();

  isHidden(buttons.userModal, true, 'Initially the modal is hidden');

  click(find(buttons.userList)[0]);

  andThen(function() {

    isVisible(buttons.userModal, true, 'Then the modal is visible');

  });
});


test('Clicking an item sets it into edit mode and focuses the input', function() {
  expect(2);
  buildAccounts();
  click(find(buttons.userList)[0]).then(function() {

    return click(find(buttons.userAccountText)[0]);

  }).then(function() {

    var store = lookups.store(),
        account = store.all('account').get('firstObject');

    equal(account.get('isEditing'), true, 'The account is being editing');
    isFocused(buttons.userAccountInput, 'The input is focussed');

  });

});


test('Clicking cancel exits edit mode and rolls back', function() {
  expect(4);
  buildAccounts();
  var store = lookups.store(),
      oldNumber = null;

  click(find(buttons.userList)[0]).then(function() {

    oldNumber = store.all('account').get('firstObject.number');

    click(find(buttons.userAccountText)[0]);
    return fillIn(find(buttons.userAccountInput)[0], '111111-222222-33333');

  }).then(function() {

    return click(find(buttons.userAccountCancel)[0]);

  }).then(function() {

    var account = store.all('account').get('firstObject'); // Because sort is descending

    equal(account.get('isEditing'), false, 'The account is not being edited');
    equal(account.get('isDirty'), false, 'The account is rolled back');
    equal(find(buttons.userAccountInput).length, 0, 'There are no inputs');
    equal(account.get('number'), oldNumber, 'The account number is not updated');

  });
});


test('Clicking save saves the record', function() {
  expect(4);
  buildAccounts();

  click(find(buttons.userList)[0]).then(function() {

    click(find(buttons.userAccountText)[0]);
    return fillIn(find(buttons.userAccountInput)[0], '111111-222222-33333');

  }).then(function() {

    return click(find(buttons.userAccountSave)[0]);

  }).then(function() {

    var store = lookups.store(),
        account = store.all('account').get('firstObject');

    equal(account.get('isEditing'), false, 'The account is not being edited');
    equal(account.get('isDirty'), false, 'The account is rolled back');
    equal(find(buttons.userAccountInput).length, 0, 'There are no inputs');
    equal(account.get('number'), '111111-222222-33333', 'The tags name is updated');

  });
});


test('Clicking an item then another clears edit and rolls back on the first', function() {
  expect(3);
  buildAccounts();

  click(find(buttons.userList)[0]).then(function() {

    return click(find(buttons.userAccountText)[0]);

  }).then(function() {

    return click(find(buttons.userAccountText)[0]); // It's the first unedited item

  }).then(function() {

    var store = lookups.store(),
        accounts = store.all('account').get('content'),
        numAccounts = accounts.length - 1;

    equal(accounts[numAccounts].get('isDirty'), false, 'The first account is not dirty');
    equal(accounts[numAccounts].get('isEditing'), false, 'The first account is not being edited');

    equal(accounts[numAccounts - 1].get('isEditing'), true, 'The second account is being edited');

  });
});


test('Clicking create starts a new record', function() {
  expect(3);
  buildAccounts();

  click(find(buttons.userList)[0]).then(function() {

    return click(buttons.userAccountCreate);

  }).then(function() {

    var store = lookups.store(),
        account = store.all('account').get('lastObject');

    equal(account.get('isEditing'), true, 'The new account is being edited');
    equal(account.get('isDirty'), true, 'The new account is dirty');
    equal(account.get('isNew'), true, 'The new account is new');

  });
});


test('Create and close buttons disappear when editing', function() {
  expect(2);
  buildAccounts();

  click(find(buttons.userList)[0]);

  andThen(function() {

    click(find(buttons.userAccountText)[0]);

    isHidden(buttons.tagsListCreate, 'The create button is hidden');
    isHidden(buttons.userAccountCreate, 'The create button is hidden');

  });
});


test('Clicking the delete button deletes the record', function() {
  expect(3);
  buildAccounts();

  click(find(buttons.userList)[0]);

  andThen(function() {

    var store = lookups.store(),
        record = store.all('account').get('firstObject'),
        numberItems = find(buttons.userAccountText).length;

    click(find(buttons.userAccountDelete)[0]);

    equal(record.get('isDeleted'), true, 'The record is deleted');
    equal(record.get('isEditing'), false, 'The record is not editing');
    equal(find(buttons.userAccountText).length, numberItems - 1, 'The DOM is removed from the list');

  });
});


test('Delete button does not exist for items with purchases', function() {
  expect(1);
  buildAccounts();

  click(find(buttons.userList)[0]);

  andThen(function() {

    var el = find(buttons.userAccountText).eq(1).siblings('.delete_container');

    equal(isEmpty(el.find('.delete')), true, 'There is no delete container');

  });
});


test('Closing the modal rolls back any records and clears isEditing', function() {
  expect(3);
  buildAccounts();

  var store = lookups.store(),
      record = null,
      oldnumber = null;

  click(find(buttons.userList)[0]).then(function() {

    record = store.all('account').get('firstObject');
    oldnumber = record.get('number');

    click(find(buttons.userAccountText)[0]);
    fillIn(find(buttons.userAccountInput)[0], 'Test test test');

    return click(buttons.modalBackground);

  }).then(function() {

    equal(record.get('isEditing'), false, 'The record is not editing');
    equal(record.get('isDirty'), false, 'The record is not dirty');
    equal(record.get('number'), oldnumber, 'The records number is rolled back');

  });
});


function buildAccounts() {
  var store = lookups.store(),
      model = store.all('user').get('firstObject'),
      fixtures = App.Account.FIXTURES;

  Ember.run(function() {
    var accounts = model.get('accounts');

    fixtures.forEach(function(fixture) {

      var newRec = store.push('account', fixture);
      accounts.pushObject(newRec);

    });
  });
}

})();

// rollback if save failed?
