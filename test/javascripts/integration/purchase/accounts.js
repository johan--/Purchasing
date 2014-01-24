
module('Accounting', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {
    $('.modal-backdrop').remove();
  }

});

test('Tax change button exists', function(){
  expect(3);

  isVisible(buttons.accountingTaxRate, 'Tax rate button is visible');
  isHidden(buttons.accountingTaxSelect, 'Tax rate select is not visible');
  isHidden(buttons.accountingTaxCancel, 'Tax menu cancel is not visible');
});

test('Clicking tax button opens tax menu', function(){
  expect(3);
  click(buttons.accountingTaxRate);

  andThen(function(){
    isHidden(buttons.accountingTaxRate, 'Tax rate button is not visible');
    isVisible(buttons.accountingTaxSelect, 'Tax rate select is visible');
    isVisible(buttons.accountingTaxCancel, 'Tax menu cancel is visible');
  });
});

test('Clicking cancel button on tax menu ', function(){
  expect(3);
  click(buttons.accountingTaxRate);
  click(buttons.accountingTaxCancel);

  andThen(function(){
    isVisible(buttons.accountingTaxRate, 'Tax rate button is visible');
    isHidden(buttons.accountingTaxSelect, 'Tax rate select is not visible');
    isHidden(buttons.accountingTaxCancel, 'Tax menu cancel is not visible');
  });
});

test('Tax button shows current tax rate', function(){
  expect(1);

  var currentTax = helperMethods.model('purchase').get('taxRateDisplay');
  contains(find(buttons.accountingTaxRate).text(), currentTax, 'Tax Rate shows the tax rate on the model');
});

test('Changing the tax rate from the menu changes the tax_rate and closes the menu', function(){
  expect(5);
  var model = helperMethods.model();

  click(buttons.accountingTaxRate);
  click(buttons.accountingTaxSelect);
  change(buttons.accountingTaxSelect, '%9.0');

  andThen(function(){
    isVisible(buttons.accountingTaxRate, 'Tax rate button is visible');
    isHidden(buttons.accountingTaxSelect, 'Tax rate select is not visible');
    isHidden(buttons.accountingTaxCancel, 'Tax menu cancel is not visible');
    equal(model.get('tax_rate'), '%9.0', 'Changing the select updates the model');
    equal(model.get('isDirty'), true, 'Changing the select flags the model as dirty the model');
  });
});


test('Clicking account text will open account menu', function(){
  expect(1);
  click(buttons.accountCurrentNumber);

  andThen(function(){
    isVisible(buttons.accountMenu, 'Account menu is visible');
  });
});


test('Clicking an account will change the Request', function(){
  expect(3);
  var model = helperMethods.model(),
      store = model.get('store'),
      acct = null;

  Ember.run(function(){
    acct = store.createRecord('Account', { number: '111222-123456-12345' });
  });

  click(buttons.accountCurrentNumber);
  click(find(buttons.accountList)[0]);

  andThen(function(){
    equal(model.get('account.number'), '111222-123456-12345', 'Clicking the account sets the records account');
    isHidden(buttons.accountMenu, 'Account menu is not visible');
    equal(model.get('isDirty'), true, 'Changing the account flags the model as dirty');
  });
});

test('Clicking add account will open new account modal', function(){
  expect(2);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  andThen(function(){
    isHidden(buttons.accountMenu, 'Account menu is not visible');
    isVisible(buttons.accountModal, 'Account modal is visible');
  });
});

test('New account modal validation for Fund < 6 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewFund, '12345');
  click(buttons.accountNewSave);

  andThen(function(){
    contains(find(buttons.accountNewFund).parent().attr('class'), 'has-error', 'Fund has an error < 6 characters');
  });
});

test('New account modal validation for Fund > 6 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewFund, '1234567');
  click(buttons.accountNewSave);

  andThen(function(){
    contains(find(buttons.accountNewFund).parent().attr('class'), 'has-error', 'Fund has an error > 6 characters');
  });
});

test('New account modal validation for Fund @ 6 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewFund, '123456');
  click(buttons.accountNewSave);
  andThen(function(){
    notContains(find(buttons.accountNewFund).parent().attr('class'), 'has-error', 'Fund does not have an error @ 6 characters');
  });
});

test('New account modal validation for Org < 6 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewOrg, '12345');
  click(buttons.accountNewSave);
  andThen(function(){
    contains(find(buttons.accountNewOrg).parent().attr('class'), 'has-error', 'Org has an error < 6 characters');
  });
});

test('New account modal validation for Org > 6 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewOrg, '1234567');
  click(buttons.accountNewSave);
  andThen(function(){
    contains(find(buttons.accountNewOrg).parent().attr('class'), 'has-error', 'Org has an error > 6 characters');
  });
});

test('New account modal validation for Org @ 6 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewOrg, '123456');
  click(buttons.accountNewSave);
  andThen(function(){
    notContains(find(buttons.accountNewOrg).parent().attr('class'), 'has-error', 'Org does not have an error @ 6 characters');
  });
});

test('New account modal validation for Acct < 5 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewAcct, '1234');
  click(buttons.accountNewSave);
  andThen(function(){
    contains(find(buttons.accountNewAcct).parent().attr('class'), 'has-error', 'Acct has an error < 5 characters');
  });
});

test('New account modal validation for Acct > 5 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewAcct, '123456');
  click(buttons.accountNewSave);
  andThen(function(){
    contains(find(buttons.accountNewAcct).parent().attr('class'), 'has-error', 'Acct has an error > 5 characters');
  });
});


test('New account modal validation for Acct @ 5 digits', function(){
  expect(1);
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewAcct, '12345');
  click(buttons.accountNewSave);
  andThen(function(){
    notContains(find(buttons.accountNewAcct).parent().attr('class'), 'has-error', 'Acct does not have an error @ 5 characters');
  });
});

test('New account AJAX', function(){
  expect(6);
  var model = helperMethods.model();

  mockUrls.addMock('/accounts', function(data){
    return { account: { number: data.number, id: 12321, user_id: data.user_id } };
  });

  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewFund, '123456');
  fillIn(buttons.accountNewOrg, '123456');
  fillIn(buttons.accountNewAcct, '12345');

  Ember.run(function(){
    model.set('requester', { id: '123', name: 'A test requester' });
  });

  click(buttons.accountNewSave);

  andThen(function(){
    var result = mockResults.ajaxParams,
        account_num = result.data.account.number,
        account_user = result.data.account.user_id;

    equal(result.type, 'POST', 'Creating a new account sends a POST');
    equal(result.url, '/accounts', 'Creating a new account sends to /accounts');
    equal(account_num, '123456-123456-12345', 'Creating a new account sends the new account');
    equal(account_user, '123', 'Creating a new account sends the new account');

    equal(model.get('isDirty'), true, 'Adding an account flags the model as dirty');
    equal(model.get('account.id'), 12321, 'After running the new account is set on the record');
  });
});
