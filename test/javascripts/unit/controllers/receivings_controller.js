
module('ReceivingsController', {
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


test('Receive All does not break relationships', function(){
  expect(22);

  var model = currentModel(),
      line1 = fixtures.createLine(1, 5),
      line2 = fixtures.createLine(2, 5),
      rec1 = fixtures.createReceiving(line1, 1),
      recLine1 = rec1.get('receivingLines.firstObject');

  myMocks.setupMockReceiveAll();

  click(buttons.receiveAll);

  andThen(function(){
    var rec2 = model.get('receivings.content.lastObject'),
        recLine2 = rec2.get('receivingLines.firstObject'),
        recLine3 = rec2.get('receivingLines.lastObject');

    equal(model.get('received'), true, 'Model is flagged as all received');
    equal(model.get('isDirty'), false, 'Model is not dirty');

    equal(line1.get('receivedCount'), 5, 'Line 1 has the correct internal received count');
    equal(line2.get('receivedCount'), 5, 'Line 2 has the correct internal received count');

    equal(rec1.get('isDirty'), false, 'rec1 is unchanged');
    equal(rec1.get('totalCount'), 1, 'Rec 1 internal total count is correct');

    equal(rec1.get('receivingLines.content.length'), 1, 'First receiving doc has one item');
    equal(rec2.get('receivingLines.content.length'), 2, 'Second receiving doc has one item');


    equal(rec2.get('isDirty'), false, 'Rec 2 is unchanged');
    equal(rec2.get('totalCount'), 9, 'Rec 2 internal total count is correct');


    equal(recLine1.get('quantity'), 1, 'ReceivingLine 1 is unchanged');
    equal(recLine1.get('isDirty'), false, 'ReceivingLine 1 is not dirty');


    equal(recLine2.get('quantity'), 4, 'ReceivingLine 2 is correct');
    equal(recLine2.get('isDirty'), false, 'ReceivingLine 2 is not dirty');


    equal(recLine3.get('quantity'), 5, 'ReceivingLine 3 is correct');
    equal(recLine3.get('isDirty'), false, 'ReceivingLine 3 is not dirty');

    // Drilling
    equal(model.get('lineItems').objectAt(1).get('receivingLines.firstObject.receiving.id'),
          rec1.get('id'), ' LineItems[0] > receivingLines[0] > receiving = rec1');

    equal(model.get('lineItems').objectAt(1).get('receivingLines.lastObject.receiving.id'),
          rec2.get('id'), ' LineItems[0] > receivingLines[1] > receiving = rec2');

    equal(model.get('lineItems.lastObject.receivingLines.firstObject.receiving.id'),
          rec2.get('id'), ' LineItems[1] > receivingLines[0] > receiving = rec2');

    equal(model.get('receivings.firstObject.receivingLines.firstObject.lineItem.id'),
          line1.get('id'), ' Model > Receivings[0] > receivingLines[0] > lineItem = line1');

    equal(model.get('receivings.lastObject.receivingLines.firstObject.lineItem.id'),
          line1.get('id'), ' Model > Receivings[1] > receivingLines[0] > lineItem = line1');

    equal(model.get('receivings.lastObject.receivingLines.lastObject.lineItem.id'),
          line2.get('id'), ' Model > Receivings[1] > receivingLines[0] > lineItem = line2');


  });
});


test('Receive All gives an error if the line items are dirty', function(){
  expect(2);
  var model = currentModel(),
      line = fixtures.createLine(null, 5),
      rec = fixtures.createReceiving(line, 2);

  myMocks.setupMockReceiveAll();

  Ember.run(function(){
    line.send('becomeDirty');
    line.set('description', 'testing')
  });

  click(buttons.receiveAll);

  andThen(function(){
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(line.get('isDirty'), false, 'The line item is rolled back');
  });
});


test('Receive All gives an error if their are any dirty receiving documents', function(){
  expect(2);
  var model = currentModel(),
      line = fixtures.createLine(null, 5),
      rec = fixtures.createReceiving(line, 2);

  myMocks.setupMockReceiveAll();

  Ember.run(function(){
    rec.send('becomeDirty');
  });

  click(buttons.receiveAll);

  andThen(function(){
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(rec.get('isDirty'), false, 'The rec is rolled back');
  });
});


test('Receive New gives an error if the line items are dirty', function(){
  expect(2);
  var model = currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function(){
    line.send('becomeDirty');
  });

  click(buttons.receivingNew);

  andThen(function(){
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(line.get('isDirty'), false, 'The line item is rolled back');
  });
});


test('Receive New gives an error if their are any dirty receiving documents', function(){
  expect(2);
  var model = currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function(){
    rec.send('becomeDirty');
  });

  click(buttons.receivingNew);

  andThen(function(){
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(rec.get('isDirty'), false, 'The rec is rolled back');
  });
});


test('Receive edit gives an error if the line items are dirty', function(){
  expect(2);
  var model = currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function(){
    line.send('becomeDirty');
  });

  click(find(buttons.receivingEdit)[0]);

  andThen(function(){
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(line.get('isDirty'), false, 'The line item is rolled back');
  });
});


test('Receive edit gives an error if their are any dirty receiving documents', function(){
  expect(2);
  var model = currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function(){
    rec.send('becomeDirty');
  });

  click(find(buttons.receivingEdit)[0]);

  andThen(function(){
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(rec.get('isDirty'), false, 'The rec is rolled back');
  });
});

