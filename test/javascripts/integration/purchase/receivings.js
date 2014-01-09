
module('Receivings', {
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
  },

  teardown: function() {
  }

});

test('A receiving document has a dom element', function(){
  visit('/purchases/1/edit').then(function(){
    var line = helperMethods.createLine(),
        rec = helperMethods.createReceiving(line);

    return wait();
  }).then(function(){
    equal(exists(buttons.receivingLines), true, 'A dom element is created for a receiving document');
  });
});

test('Hovering a receiving document', function(){
  visit('/purchases/1/edit').then(function(){
    var controller = helperMethods.controller('purchase.edit'),
        line = helperMethods.createLine(),
        rec = helperMethods.createReceiving(line);

    mouseOver(find(buttons.receivingLines)[0]);

    andThen(function(){
      equal(controller.get('currentReceivingHoverDoc'), rec, 'Hovering a receiving doc sets it to currentReceivingHoverDoc');
    });
  });
});

test('Clicking a receiving document', function(){
  var controller, rec;

  visit('/purchases/1/edit').then(function(){
    controller = helperMethods.controller('purchase.edit');
    var line = helperMethods.createLine();
    rec = helperMethods.createReceiving(line);

    return click(find(buttons.receivingEdit)[0]);

  }).then(function(){
    equal(controller.get('currentReceivingDoc.id'), rec.id, 'Clicking a receiving doc sets it to currentReceivingDoc');

    return click(find(buttons.receivingCancel));
  }).then(function(){

    equal(controller.get('currentReceivingDoc'), null, 'Clicking cancel clears currentReceivingDoc');
  });
});


