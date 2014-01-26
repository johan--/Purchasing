
module('Receivings', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {
  }

});


test('A receiving document has a dom element', function(){
  expect(1);
  var line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line);

  andThen(function(){
    equal(exists(buttons.receivingLines), true, 'A dom element is created for a receiving document');
  });
});


test('Hovering a receiving document', function(){
  expect(1);
  var controller = helperMethods.controller('purchase.edit'),
      line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line);

  mouseOver(find(buttons.receivingLines)[0]);

  andThen(function(){
    equal(controller.get('currentReceivingHoverDoc'), rec, 'Hovering a receiving doc sets it to currentReceivingHoverDoc');
  });
});


test('Clicking a receiving document', function(){
  expect(4);
  var controller = helperMethods.controller('purchase.edit'),
      line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line);

  click(find(buttons.receivingEdit)[0]);

  andThen(function(){
    equal(controller.get('currentReceivingDoc.id'), rec.id, 'Clicking a receiving doc sets it to currentReceivingDoc');

    isVisible(buttons.receivingRecSave, 'Receiving Save button appears after click');
    isVisible(buttons.receivingRecCancel, 'Receiving Cancel button appears after click');

    return click(find(buttons.receivingRecCancel));
  }).then(function(){

    equal(controller.get('currentReceivingDoc'), null, 'Clicking cancel clears currentReceivingDoc');
  });
});


test('Receive All', function(){
  expect(2);
  mockUrls.addMock('/purchases/1/receive_all', function(){
    return { purchase: { id: 1, received: true } };
  });
  click(buttons.receiveAll);

  andThen(function(){
    equal(mockResults.ajaxParams.url, '/purchases/1/receive_all', 'Clicking Receive All creates an appropriate AJAX request');
    equal(mockResults.ajaxParams.type, 'post', 'Clicking Receive All creates an appropriate AJAX request');
  });
});


test('Receive New', function(){
  expect(1);
  var controller = helperMethods.controller('purchase.edit');
  click(buttons.receivingNew);

  andThen(function(){
    equal(controller.get('model.receivings.length'), 1, 'Clicking the new button creates a Receiving Document');
  });
});


test('Receive Save Rec', function(){
  expect(2);
  var line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line);

  click(find(buttons.receivingEdit)[0]);

  andThen(function(){
    equal(rec.get('isDirty'), true, 'Record starts out dirty');

    click(buttons.receivingRecSave);

    andThen(function(){
      equal(rec.get('isDirty'), false, 'Saving the record removes dirty state');
    });
  });
});
