
module('Integration - Purchase - Breadcrumbs', {
  setup: function() {

    // Build fixtures
    fixtures.reset();
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

  fixtures.updateAllFixtures(App.Purchase, { starred: '1/1/2014' });
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

  fixtures.updateAllFixtures(App.Purchase, { buyer: { id: 1, name: 'a test buyer' } });
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

  fixtures.updateAllFixtures(App.Purchase, { datePurchased: '1/1/2014', buyer: { id: 1, name: 'a test buyer' } });
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 1, 'There are two tabs');
    contains(find(buttons.purchaseTabs).first().text(), 'Purchased', 'Purchased tab has the correct text');
  });
});


test('Reconciled tab', function(){
  expect(2);
  visit('/purchases/1/show');

  fixtures.updateAllFixtures(App.Purchase, { dateReconciled: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 1, 'There are two tabs');
    contains(find(buttons.purchaseTabs).first().text(), 'Reconciled', 'Reconciled tab has the correct text');
  });
});


test('Canceled tab', function(){
  expect(2);
  visit('/purchases/1/show');

  fixtures.updateAllFixtures(App.Purchase, { dateCanceled: '1/1/2014' });
  visit('/purchases/1/edit');

  andThen(function(){
    equal(find(buttons.purchaseTabs).length, 1, 'There are two tabs');
    contains(find(buttons.purchaseTabs).first().text(), 'Canceled', 'Canceled tab has the correct text');
  });
});
