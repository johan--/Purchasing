
module('Purchases-Row', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadataFor('purchase');

    // Clear fixtures
    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: null,
                                       dateReconciled: null,
                                       dateCancelled: null });
  },

  teardown: function() {
    mockResults.clearMockResults();
  }
});

test('-Can click a record to edit', function(){

  visit('/purchases?tab=New').then(function(){

    return click(find(buttons.purchaseEdit)[0]);

  }).then(function(){
    equal(path(), 'purchase.edit', 'Opening a record transitions to edit');

  });
});

test('-Can click a record to show', function(){

  visit('/purchases?tab=New').then(function(){

    return click(find(buttons.purchaseShow)[0]);

  }).then(function(){
    equal(path(), 'purchase.show', 'Opening a record transitions to show');  // TODO

  });
});

test('-Can Star a record', function(){
  visit('/purchases?tab=New').then(function(){

    return click(buttons.firstRowStar);
  }).then(function(){

    equal(mockResults.ajaxParams.url, '/purchases/1/toggle_starred', 'Starring calls correct URL');
    equal(mockResults.ajaxParams.type, 'post', 'Assigning calls POST');

    equal(path(), 'purchases.tabs', 'Edit window should not open');

    equal(find('.alert:contains("Star updated")').length, 1, 'A success notification should appear');
  });
});

test('-Delete a record', function(){
  visit('/purchases?tab=New').then(function(){

    return click(find(buttons.purchaseDelete)[0]);
  }).then(function(){

    contains(mockResults.alertMessage, 'This will permanently delete this record', 'Clicking delete displays confirmation');
    equal(find(buttons.purchaseRow).length, 4, 'After deleting there should be 4 records');

    var purchases = helperMethods.store().all(App.Purchase).filter(function(rec){
      if (rec.id == 1) return true;
    });

    equal(purchases.length, 0, 'Deleted record should be removed from fixtures');

    equal(path(), 'purchases.tabs', 'Edit window should not open');

    equal(find('.alert:contains("Record deleted")').length, 1, 'A success notification should appear');
  });
});
