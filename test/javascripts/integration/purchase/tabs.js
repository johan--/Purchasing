
module('Purchase Label Tabs', {
  setup: function() {

    // Build fixtures
    injectFixtures();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {

  }

});


test('There can be multiple tabs', function(){
  expect(1);
  visit('/purchases/1/show');

  updateTestFixtures(App.Purchase, { starred: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 2, 'There are two tabs');
  });
});

/*
test('New tab', function(){
  expect(2);
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 1, 'There are two tabs');
    contains(find(buttons.purchaseTabs).first().text(), 'New', 'New tab has the correct text');
  });
});


test('Pending tab', function(){
  expect(2);
  visit('/purchases/1/show');

  updateTestFixtures(App.Purchase, { buyer: { id: 1, name: 'a test buyer' } });
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 1, 'There are two tabs');
    contains(find(buttons.purchaseTabs).first().text(), 'Pending', 'Pending tab has the correct text');
  });
});
*/

test('Purchased tab', function(){
  expect(2);
  visit('/purchases/1/show');

  updateTestFixtures(App.Purchase, { datePurchased: '1/1/2014', buyer: { id: 1, name: 'a test buyer' } });
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 1, 'There are two tabs');
    contains(find(buttons.purchaseTabs).first().text(), 'Purchased', 'Purchased tab has the correct text');
  });
});


test('Reconciled tab', function(){
  expect(2);
  visit('/purchases/1/show');

  updateTestFixtures(App.Purchase, { dateReconciled: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 1, 'There are two tabs');
    contains(find(buttons.purchaseTabs).first().text(), 'Reconciled', 'Reconciled tab has the correct text');
  });
});


test('Cancelled tab', function(){
  expect(2);
  visit('/purchases/1/show');

  updateTestFixtures(App.Purchase, { dateCancelled: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 1, 'There are two tabs');
    contains(find(buttons.purchaseTabs).first().text(), 'Cancelled', 'Cancelled tab has the correct text');
  });
});
