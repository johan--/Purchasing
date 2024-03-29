
module('Integration - Purchases - Row', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/tabs?tab=Purchased');
  },

  teardown: function() {

  }
});


test('Can click a record to edit', function() {
  expect(1);
  click(find(buttons.purchaseEdit)[0]);

  andThen(function() {
    equal(lookups.path(), 'purchase.edit', 'Opening a record transitions to edit');
  });
});


test('Can click a record to show', function() {
  expect(1);
  click(find(buttons.purchaseShow)[0]);

  andThen(function() {
    equal(lookups.path(), 'purchase.show', 'Opening a record transitions to show');  // TODO
  });
});


test('Can Star a record', function() {
  expect(4);
  click(buttons.firstRowStar);

  andThen(function() {

    var application = lookups.controller('application');

    equal(myMocks.ajaxParams.url, App.getUrl('/purchases/1'), 'Starring calls correct URL');
    equal(myMocks.ajaxParams.type, 'PUT', 'Assigning calls PUT');

    equal(lookups.path(), 'purchases.tabs', 'Edit window should not open');
    contains(application.get('notifications')[0].message, 'Star updated', 'A success notification should appear');

  });
});


test('Delete a record', function() {
  expect(5);
  click(find(buttons.purchaseDelete)[0]);

  andThen(function() {

    contains(myMocks.alertMessage, 'This will permanently delete this record', 'Clicking delete displays confirmation');
    equal(find(buttons.purchaseRow).length, 4, 'After deleting there should be 4 records');

    var purchases = lookups.store().all(App.Purchase).filter(function(rec){
      if (rec.id == 1) return true;
    });

    equal(purchases.length, 0, 'Deleted record should be removed from fixtures');

    equal(lookups.path(), 'purchases.tabs', 'Edit window should not open');

    // Double since there are mobile and desktop versions
    equal(find('.alert:contains("Record deleted")').length, 2, 'A success notification should appear');
  });
});
