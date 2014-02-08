
module('Purchases-Row', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    injectFixtures();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/tabs?tab=Purchased');
  },

  teardown: function() {

  }
});


test('-Can click a record to edit', function(){
  expect(1);
  click(find(buttons.purchaseEdit)[0]);

  andThen(function(){
    equal(path(), 'purchase.edit', 'Opening a record transitions to edit');
  });
});


test('-Can click a record to show', function(){
  expect(1);
  click(find(buttons.purchaseShow)[0]);

  andThen(function(){
    equal(path(), 'purchase.show', 'Opening a record transitions to show');  // TODO
  });
});


test('-Can Star a record', function(){
  expect(4);
  click(buttons.firstRowStar);

  andThen(function(){
    equal(myMocks.ajaxParams.url, App.Globals.namespace + '/purchases/1/toggle_starred', 'Starring calls correct URL');
    equal(myMocks.ajaxParams.type, 'POST', 'Assigning calls POST');

    equal(path(), 'purchases.tabs', 'Edit window should not open');

    equal(find('.alert:contains("Star updated")').length, 1, 'A success notification should appear');
  });
});


test('-Delete a record', function(){
  expect(5);
  click(find(buttons.purchaseDelete)[0]);

  andThen(function(){

    contains(myMocks.alertMessage, 'This will permanently delete this record', 'Clicking delete displays confirmation');
    equal(find(buttons.purchaseRow).length, 4, 'After deleting there should be 4 records');

    var purchases = lookupStore().all(App.Purchase).filter(function(rec){
      if (rec.id == 1) return true;
    });

    equal(purchases.length, 0, 'Deleted record should be removed from fixtures');

    equal(path(), 'purchases.tabs', 'Edit window should not open');

    equal(find('.alert:contains("Record deleted")').length, 1, 'A success notification should appear');
  });
});
