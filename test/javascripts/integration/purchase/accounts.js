
module('Accounting', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadataFor('purchase');

    // Clear fixtures
    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: null,
                                       dateReconciled: null,
                                       dateCancelled: null });
    visit('/purchases/1/edit');
  },

  teardown: function() {
    $('.modal-backdrop').remove();
  }

});

test('Tax change button exists', function(){
  equal(isVisible(buttons.accountingTaxRate), true, 'Tax rate button is visible');
  equal(isVisible(buttons.accountingTaxSelect), false, 'Tax rate select is not visible');
  equal(isVisible(buttons.accountingTaxCancel), false, 'Tax menu cancel is not visible');
});

test('Clicking tax button opens tax menu', function(){
  click(buttons.accountingTaxRate);

  andThen(function(){
    equal(isVisible(buttons.accountingTaxRate), false, 'Tax rate button is not visible');
    equal(isVisible(buttons.accountingTaxSelect), true, 'Tax rate select is visible');
    equal(isVisible(buttons.accountingTaxCancel), true, 'Tax menu cancel is visible');
  });
});

test('Clicking cancel button on tax menu ', function(){
  click(buttons.accountingTaxRate);
  click(buttons.accountingTaxCancel);

  andThen(function(){
    equal(isVisible(buttons.accountingTaxRate), true, 'Tax rate button is visible');
    equal(isVisible(buttons.accountingTaxSelect), false, 'Tax rate select is not visible');
    equal(isVisible(buttons.accountingTaxCancel), false, 'Tax menu cancel is not visible');
  });
});

test('Tax button shows current tax rate', function(){
  var currentTax = helperMethods.model('purchase').get('taxRateDisplay');
  contains(find(buttons.accountingTaxRate).text(), currentTax, 'Tax Rate shows the tax rate on the model');
});

test('Changing the tax rate from the menu closes the menu', function(){
  click(buttons.accountingTaxRate);
  click(buttons.accountingTaxSelect);
  change(buttons.accountingTaxSelect);

  andThen(function(){
    equal(isVisible(buttons.accountingTaxRate), true, 'Tax rate button is visible');
    equal(isVisible(buttons.accountingTaxSelect), false, 'Tax rate select is not visible');
    equal(isVisible(buttons.accountingTaxCancel), false, 'Tax menu cancel is not visible');
  });
});


test('Clicking account text will open account menu', function(){
  click(buttons.accountCurrentNumber);

  andThen(function(){
    equal(isVisible(buttons.accountMenu), true, 'Account menu is visible');
  });
});


test('Clicking an account will change the Request', function(){
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
    equal(isVisible(buttons.accountMenu), false, 'Account menu is not visible');
  });
});

test('Clicking add account will open new account modal', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  andThen(function(){
    equal(isVisible(buttons.accountMenu), false, 'Account menu is not visible');
    equal(isVisible(buttons.accountModal), true, 'Account modal is visible');
  });
});

test('New account modal validation for Fund < 6 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewFund, '12345');
  click(buttons.accountNewSave);

  andThen(function(){
    contains(find(buttons.accountNewFund).parent().attr('class'), 'has-error', 'Fund has an error < 6 characters');
  });
});

test('New account modal validation for Fund > 6 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewFund, '1234567');
  click(buttons.accountNewSave);

  andThen(function(){
    contains(find(buttons.accountNewFund).parent().attr('class'), 'has-error', 'Fund has an error > 6 characters');
  });
});

test('New account modal validation for Fund @ 6 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewFund, '123456');
  click(buttons.accountNewSave);
  andThen(function(){
    notContains(find(buttons.accountNewFund).parent().attr('class'), 'has-error', 'Fund does not have an error @ 6 characters');
  });
});

test('New account modal validation for Org < 6 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewOrg, '12345');
  click(buttons.accountNewSave);
  andThen(function(){
    contains(find(buttons.accountNewOrg).parent().attr('class'), 'has-error', 'Org has an error < 6 characters');
  });
});

test('New account modal validation for Org > 6 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewOrg, '1234567');
  click(buttons.accountNewSave);
  andThen(function(){
    contains(find(buttons.accountNewOrg).parent().attr('class'), 'has-error', 'Org has an error > 6 characters');
  });
});

test('New account modal validation for Org @ 6 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewOrg, '123456');
  click(buttons.accountNewSave);
  andThen(function(){
    notContains(find(buttons.accountNewOrg).parent().attr('class'), 'has-error', 'Org does not have an error @ 6 characters');
  });
});

test('New account modal validation for Acct < 5 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewAcct, '1234');
  click(buttons.accountNewSave);
  andThen(function(){
    contains(find(buttons.accountNewAcct).parent().attr('class'), 'has-error', 'Acct has an error < 5 characters');
  });
});

test('New account modal validation for Acct > 5 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewAcct, '123456');
  click(buttons.accountNewSave);
  andThen(function(){
    contains(find(buttons.accountNewAcct).parent().attr('class'), 'has-error', 'Acct has an error > 5 characters');
  });
});


test('New account modal validation for Acct @ 5 digits', function(){
  click(buttons.accountCurrentNumber);
  click(buttons.accountEditAdd);

  fillIn(buttons.accountNewAcct, '12345');
  click(buttons.accountNewSave);
  andThen(function(){
    notContains(find(buttons.accountNewAcct).parent().attr('class'), 'has-error', 'Acct does not have an error @ 5 characters');
  });
});

test('New account AJAX', function(){
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

    equal(model.get('account.id'), 12321, 'After running the new account is set on the record');
  });
});
