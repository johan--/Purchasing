
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
