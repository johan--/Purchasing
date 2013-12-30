
module('Purchase Edit', {
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

test('Route name is purchase.edit', function(){
  visit('/purchases/1/edit').then(function(){
    equal(path(), 'purchase.edit', 'PAth is set to purchase.edit');
  });
});

test('Route name is purchase.show', function(){
  visit('/purchases/1/show').then(function(){
    equal(path(), 'purchase.show', 'Path is set to purchase.show');
    equal(find('input').length, 0, 'There should be no inputs in show');
  });
});

test('Clicking edit button transitions to edit', function(){
  visit('/purchases/1/show').then(function(){
    return click(find(buttons.purchaseStartEdit));
  }).then(function(){
    equal(path(), 'purchase.edit', 'Clicking edit button in show transitions to purchase.edit');
    
    return click(find(buttons.purchaseStartEdit));
  }).then(function(){
    equal(path(), 'purchase.show', 'Clicking edit button in edit transitions to purchase.show'); 
  });
});

test('Claim and unclaim a record', function() {
  
  mockUrls.addMock('/purchases/assign', function(data) {
    var model = Ember.copy(App.Purchase.FIXTURES[data.id]);
    
    model.buyer = { name: 'testBuyer', id: data.buyer_d };

    return model;
  });

  visit('/purchases/1/edit').then(function(){
    var cur_user = helperMethods.model('purchase').get('buyer');
    equal(cur_user, null, 'Current record is not assigned');

    return click(buttons.purchaseClaim);
  }).then(function(){
    var cur_user = helperMethods.model('purchase').get("buyer");
    console.log(cur_user);
    equal(cur_user.id, META_FIXTURE.currentUser.id, 'Sets the buyer_id to the current user when claiming');
  
    return click(buttons.purchaseUnclaim);
  }).then(function(){
    var cur_user = helperMethods.model('ppurchase').get('buyer');
    equal(cur_user, null, 'Sets the buyer to null when unclaiming');
  });;
});
