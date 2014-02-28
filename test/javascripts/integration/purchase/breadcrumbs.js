
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


test('There can be multiple crumbs', function() {
  expect(1);

  fixtures.updateOneFixture(App.Purchase, 1, { starred: '1/1/2014' });

  andThen(function() {
    equal(find(buttons.purchaseCrumbs).length, 2, 'There are three crumbs');
  });
});

/*
test('New crumb', function() {
  expect(2);
  visit('/purchases/1/edit');

  andThen(function() {
    equal(find(buttons.purchaseCrumbs).length, 1, 'There are two crumbs');
    contains(find(buttons.purchaseCrumbs).first().text(), 'New', 'New crumb has the correct text');
  });
});


test('Pending crumb', function() {
  expect(2);
  visit('/purchases/1/show');

  fixtures.updateAllFixtures(App.Purchase, { buyer: { id: 1, name: 'a test buyer' } });
  visit('/purchases/1/edit');

  andThen(function() {
    equal(find(buttons.purchaseCrumbs).length, 1, 'There are two crumbs');
    contains(find(buttons.purchaseCrumbs).first().text(), 'Pending', 'Pending crumb has the correct text');
  });
});

test('Reconciled crumb', function() {
  expect(2);
  fixtures.updateOneFixture(App.Purchase, 1, { dateReconciled: '1/1/2014' });

  andThen(function() {
    equal(find(buttons.purchaseCrumbs).length, 1, 'There are two crumbs');
    contains(find(buttons.purchaseCrumbs).first().text(), 'Reconciled', 'Reconciled crumb has the correct text');
  });
});
*/

test('Purchased crumb', function() {
  expect(2);
  fixtures.updateOneFixture(App.Purchase, 1, { datePurchased: '1/1/2014', buyer: { id: 1, name: 'a test buyer' } });

  andThen(function() {
    equal(find(buttons.purchaseCrumbs).length, 1, 'There are two crumbs');
    contains(find(buttons.purchaseCrumbs).first().text(), 'Purchased', 'Purchased crumb has the correct text');
  });
});


test('Received crumb', function() {
  expect(2);

  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  andThen(function() {
    equal(find(buttons.purchaseCrumbs).length, 1, 'There are two crumbs');
    contains(find(buttons.purchaseCrumbs).first().text(), 'Received', 'Received crumb has the correct text');
  });
});


test('Canceled crumb', function() {
  expect(2);
  fixtures.updateOneFixture(App.Purchase, 1, { dateCanceled: '1/1/2014' });

  andThen(function() {
    equal(find(buttons.purchaseCrumbs).length, 1, 'There are two crumbs');
    contains(find(buttons.purchaseCrumbs).first().text(), 'Canceled', 'Canceled crumb has the correct text');
  });
});
