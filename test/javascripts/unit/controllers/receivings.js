
module('Unit - Controllers - Receivings', {
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

test('Receive All does not break relationships', function() {
  expect(22);

  var model = lookups.currentModel(),
      line1 = fixtures.createLine(1, 5),
      line2 = fixtures.createLine(2, 5),
      rec1 = fixtures.createReceiving(line1, 1),
      recLine1 = rec1.get('receivingLines.firstObject');

  myMocks.setupMockReceiveAll();

  click(buttons.receiveAll);

  andThen(function() {
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


test('Editing sets and clears receivingGlobals', function() {
  expect(2);
  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  click(find(buttons.receivingEdit)[0]);
  click(buttons.receivingRecCancel);

  andThen(function() {
    equal(App.ReceivingGlobals.get('currentReceivingDoc'), null, 'Canceling clears the globals object');
    equal(App.ReceivingGlobals.get('currentReceivingHoverDoc'), null, 'Canceling clears the globals object');
  });
});


test('Receive delete clears receivingGlobals', function() {
  expect(3);
  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function() {
    App.ReceivingGlobals.set('currentReceivingDoc', 'TEST');
  });

  click(find(buttons.receivingDelete)[0]);

  andThen(function() {
    equal(App.ReceivingGlobals.get('currentReceivingDoc'), null, 'Canceling clears the globals object');
    equal(App.ReceivingGlobals.get('currentReceivingHoverDoc'), null, 'Canceling clears the globals object');
    equal(rec.get('isDeleted'), true, 'The receiving document is deleted');
  });
});


test('Transitioning from edit clears receivingGlobals', function() {
  expect(2);
  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  click(find(buttons.receivingEdit)[0]);
  visit('/purchases/tabs');

  andThen(function() {
    equal(App.ReceivingGlobals.get('currentReceivingDoc'), null, 'Canceling clears the globals object');
    equal(App.ReceivingGlobals.get('currentReceivingHoverDoc'), null, 'Canceling clears the globals object');
  });
});


test('Transitioning from show clears receivingGlobals', function() {
  expect(2);
  visit('/purchases/1/show');

  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  click(find(buttons.receivingEdit)[0]);
  visit('/purchases/tabs');

  andThen(function() {
    equal(App.ReceivingGlobals.get('currentReceivingDoc'), null, 'Canceling clears the globals object');
    equal(App.ReceivingGlobals.get('currentReceivingHoverDoc'), null, 'Canceling clears the globals object');
  });
});


test('Saving a receiving document clears receivingGlobals', function() {
  expect(2);
  var rec = null;

  visit('/purchases/1/show').then(function() {

    var line = fixtures.createLine();
    rec = fixtures.createReceiving(line);

    return click(find(buttons.receivingEdit)[0]);

  }).then(function() {

    Ember.run(function() {
      rec.send('becomeDirty');
    });

    return click(buttons.receivingRecSave);

  }).then(function() {

    equal(App.ReceivingGlobals.get('currentReceivingDoc'), null, 'Canceling clears the globals object');
    equal(App.ReceivingGlobals.get('currentReceivingHoverDoc'), null, 'Canceling clears the globals object');

  });
});


test('Deleting a receiving document unloads lines', function(){
  expect(6);
  var model = lookups.currentModel(),
      line1 = fixtures.createLine(),
      line2 = fixtures.createLine(),
      line3 = fixtures.createLine(),
      rec = fixtures.createReceiving(line1),
      recLine1 = rec.get('receivingLines.firstObject'),
      recLine2 = null;

  Ember.run(function() {
    var store = lookups.store();

    recLine2 = fixtures.createObject(null, 'receivingLine', { quantity: 5,
                                                     lineItem: line2.id,
                                                     receiving: rec.id }, true);
    line2.get('receivingLines').pushObject(recLine2);
    rec.get('receivingLines').pushObject(recLine2);
  });

  click(find(buttons.receivingDelete)[0]);

  andThen(function() {

    equal(model.get('receivings.firstObject'), null, 'The receiving document is removed from purchase');
    equal(line1.get('receivingLines.firstObject'), null, 'The receiving line is removed from the first line item');
    equal(line2.get('receivingLines.firstObject'), null, 'The receiving line is removed from the second line item');
    equal(rec.get('isDeleted'), true, 'The receiving document is deleted');
    equal(recLine1.get('isDeleted'), true, 'The receiving line document is deleted');
    equal(recLine2.get('isDeleted'), true, 'The receiving line document is deleted');

  });
});


test('Deleting a receiving document unloads dirty lines', function(){
  expect(6);
  var model = lookups.currentModel(),
      line1 = fixtures.createLine(),
      line2 = fixtures.createLine(),
      line3 = fixtures.createLine(),
      rec = fixtures.createReceiving(line1),
      recLine1 = rec.get('receivingLines.firstObject'),
      recLine2 = null;

  Ember.run(function() {
    var store = lookups.store();

    recLine2 = fixtures.createObject(null, 'receivingLine', { quantity: 5,
                                                     lineItem: line2.id,
                                                     receiving: rec.id }, true);
    line2.get('receivingLines').pushObject(recLine2);
    rec.get('receivingLines').pushObject(recLine2);
    recLine1.send('becomeDirty');
  });

  click(find(buttons.receivingDelete)[0]);

  andThen(function() {

    equal(model.get('receivings.firstObject'), null, 'The receiving document is removed from purchase');
    equal(line1.get('receivingLines.firstObject'), null, 'The receiving line is removed from the first line item');
    equal(line2.get('receivingLines.firstObject'), null, 'The receiving line is removed from the second line item');
    equal(rec.get('isDeleted'), true, 'The receiving document is deleted');
    equal(recLine1.get('isDeleted'), true, 'The receiving line document is deleted');
    equal(recLine2.get('isDeleted'), true, 'The receiving line document is deleted');

  });
});


test('Deleting an edited final receive document', function() {
  var model = lookups.currentModel(),
      line1 = fixtures.createLine(1, 5),
      line2 = fixtures.createLine(2, 5),
      rec = null,
      recLine1 = null;

  myMocks.setupMockReceiveAll();

  click(buttons.receiveAll).then(function() {

    Ember.run(function() {
      rec = model.get('receivings.firstObject');
      recLine1 = rec.get('receivingLines.lastObject');

      rec.send('becomeDirty');
      recLine1.send('becomeDirty');
    });

    click(buttons.receivingRecCancel);
    click(find(buttons.receivingDelete)[0]);

  }).then(function() {

    equal(model.get('receivings.firstObject'), null, 'The receiving document is removed from purchase');
    equal(line1.get('receivingLines.firstObject'), null, 'The receiving line is removed from the first line item');
    equal(line2.get('receivingLines.firstObject'), null, 'The receiving line is removed from the second line item');
    equal(rec.get('isDeleted'), true, 'The receiving document is deleted');
    equal(recLine1.get('isDeleted'), true, 'The receiving line document is deleted');

  });
});



// Ideally we would check the receivings and receivingLines quantities from both model
// and lineItem, however the fixture adapter does not appear to work with this
// as well as the normal adapter does

test('Receive all unloads dirty lines first', function() {
  expect(9);
  var store = lookups.store(),
      model = lookups.currentModel(),
      line = fixtures.createLine(),
      oldDescription = line.get('description'),
      rec1 = null,
      recLine1 = null;

  myMocks.setupMockReceiveAll();

  Ember.run(function() {
    rec1 = store.createRecord('receiving', { purchase: model });
    recLine1 = store.createRecord('receivingLine', { quantity: 3,
                                                    lineItem: line,
                                                    receiving: rec1 });
    line.set('description', 'An updated description');
  });

  click(buttons.receiveAll);

  andThen(function() {

    var rec2 = model.get('receivings.lastObject'),
        recLine2 = rec2.get('receivingLines.firstObject');

    equal(rec1.get('isDeleted'), true, 'The first receiving document is deleted');
    equal(rec2.get('receivingLines.content.length'), 1, 'The second receiving document has one receiving line');
    equal(rec2.get('isDirty'), false, 'The second receiving document is not dirty');

    equal(recLine1.get('isDeleted'), true, 'The dirty receiving line is deleted');
    equal(recLine2.get('quantity'), 5, 'The second receiving line has the full quantity');
    equal(recLine2.get('isDirty'), false, 'The second receiving line is not dirty');

    equal(line.get('isDirty'), false, 'The line item is rolled back');
    equal(line.get('description'), oldDescription, 'The description has rolled back');
    equal(line.get('receivedCount'), 5, 'The line item has the correct received count');
  });
});


test('Receive new unloads dirty records first', function() {
  expect(5);
  var store = lookups.store(),
      model = lookups.currentModel(),
      line = fixtures.createLine(),
      oldDescription = line.get('description'),
      rec1 = null,
      recLine1 = null;

  Ember.run(function() {
    rec1 = store.createRecord('receiving', { purchase: model });
    recLine1 = store.createRecord('receivingLine', { quantity: 3,
                                                    lineItem: line,
                                                    receiving: rec1 });
    line.set('description', 'An updated description');
  });

  click(buttons.receivingNew);

  andThen(function() {

    equal(rec1.get('isDeleted'), true, 'The first receiving document is deleted');

    equal(recLine1.get('isDeleted'), true, 'The dirty receiving line is deleted');

    equal(line.get('isDirty'), false, 'The line item is rolled back');
    equal(line.get('description'), oldDescription, 'The description has rolled back');
    equal(line.get('receivedCount'), 0, 'The line item has no items received');

  });
});


test('Receive edit unloads dirty records first', function() {
  expect(5);
  var store = lookups.store(),
      model = lookups.currentModel(),
      line1 = fixtures.createLine(),
      line2 = fixtures.createLine(),
      oldDescription = line1.get('description'),
      rec1 = null,
      rec2 = fixtures.createReceiving(line2),
      recLine1 = null;

  Ember.run(function() {
    rec1 = store.createRecord('receiving', { purchase: model });
    recLine1 = store.createRecord('receivingLine', { quantity: 3,
                                                    lineItem: line1,
                                                    receiving: rec1 });
    line1.set('description', 'An updated description');
  });

  click(find(buttons.receivingEdit)[0]);

  andThen(function() {

    equal(rec1.get('isDeleted'), true, 'The first receiving document is deleted');

    equal(recLine1.get('isDeleted'), true, 'The dirty receiving line is deleted');

    equal(line1.get('isDirty'), false, 'The first line item is rolled back');
    equal(line1.get('description'), oldDescription, 'The description has rolled back');
    equal(line1.get('receivedCount'), 0, 'The line item has the correct received count');

  });
});


test('_checkItemsForDirty with line items', function() {
  expect(1);
  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      recLine = rec.get('receivingLines.firstObject');

  Ember.run(function() {
    line.send('becomeDirty');
  });
  click(buttons.receivingNew);

  andThen(function() {

    contains(myMocks.alertMessage, 'there are unsaved line items', 'Line items being dirty warn when modifying receivings');

  });
});

test('_checkItemsForDirty with receivings', function() {
  expect(1);
  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      recLine = rec.get('receivingLines.firstObject');

  Ember.run(function() {
    rec.send('becomeDirty');
    recLine.send('becomeDirty');
  });
  click(buttons.receivingNew);

  andThen(function() {

    contains(myMocks.alertMessage, 'there are unsaved receivings', 'Receivings being dirty warn when modifying receivings');

  });
});


test('Receive All > Edit does not create a new receiving line', function() {
  expect(2);
  var store = lookups.store(),
      model = lookups.currentModel(),
      line = fixtures.createLine();

  myMocks.setupMockReceiveAll();

  click(buttons.receiveAll);

  andThen(function() {

    click(find(buttons.receivingPlus)[1]);
    var countFromLine = line.get('receivingLines.content.length'),
        countFromRec = model.get('receivings.firstObject.receivingLines.content.length');

    equal(countFromLine, 1, 'There is only one receiving line from lineItem');
    equal(countFromRec, 1, 'There is only one receiving line from receiving');

  });
});


test('Updating a receiving line does not create a new one', function() {
  expect(3);
  var store = lookups.store(),
      model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[1]);

  andThen(function() {

    equal(store.all('receivingLine').get('content.length'), 1, 'There is only one receiving line in the store');
    equal(rec.get('receivingLines.content.length'), 1, 'There is only one receiving line for the receiving document');
    equal(line.get('receivingLines.content.length'), 1, 'There is only one receiving line for the line item');

  });
});


test('Editing a receiving line then rolling back', function() {
  expect(3);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      recLine = rec.get('receivingLines.firstObject');

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[1]);
  click(buttons.receivingRecCancel);

  andThen(function() {

    equal(rec.get('isDirty'), false, 'The receiving document is not dirty');
    equal(recLine.get('isDirty'), false, 'The receiving line is not dirty');

    equal(recLine.get('quantity'), 5, 'The receiving line is rolled back');
  });
});
