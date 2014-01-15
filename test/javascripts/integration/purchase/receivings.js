
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

    visit('/purchases/1/edit');
  },

  teardown: function() {
  }

});

test('A receiving document has a dom element', function(){
  var line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line);

  andThen(function(){
    equal(exists(buttons.receivingLines), true, 'A dom element is created for a receiving document');
  });
});

test('Hovering a receiving document', function(){
  var controller = helperMethods.controller('purchase.edit'),
      line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line);

  mouseOver(find(buttons.receivingLines)[0]);

  andThen(function(){
    equal(controller.get('currentReceivingHoverDoc'), rec, 'Hovering a receiving doc sets it to currentReceivingHoverDoc');
  });
});

test('Clicking a receiving document', function(){
  var controller = helperMethods.controller('purchase.edit'),
      line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line);

  click(find(buttons.receivingEdit)[0]);

  andThen(function(){
    equal(controller.get('currentReceivingDoc.id'), rec.id, 'Clicking a receiving doc sets it to currentReceivingDoc');

    return click(find(buttons.receivingRecCancel));
  }).then(function(){

    equal(controller.get('currentReceivingDoc'), null, 'Clicking cancel clears currentReceivingDoc');
  });
});

test('Receive All', function(){
  expect(0);
});

test('Receive New', function(){
  expect(0);
});

test('Receive Save Rec', function(){
  expect(0);
});

test('Receive Cancel Rec', function(){
  expect(0);
});
