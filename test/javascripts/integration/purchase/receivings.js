
module('Integration - Purchase - Receivings', {
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


test('A receiving document has a dom element', function() {
  expect(1);
  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  andThen(function() {
    exists(buttons.receivingLines, 'A dom element is created for a receiving document');
  });
});


test('Receive All', function() {
  expect(2);

  var line1 = fixtures.createLine(1, 5),
      line2 = fixtures.createLine(2, 5),
      rec1 = fixtures.createReceiving(line1, 1);

  myMocks.setupMockReceiveAll();

  click(buttons.receiveAll);

  andThen(function() {
    equal(myMocks.ajaxParams.url, App.getUrl('/purchases/1/receive_all'), 'Clicking Receive All creates an appropriate AJAX request');
    equal(myMocks.ajaxParams.type, 'POST', 'Clicking Receive All creates an appropriate AJAX request');
  });
});


test('Receive New', function() {
  expect(1);
  var controller = lookups.controller('purchase.edit');
  click(buttons.receivingNew);

  andThen(function() {
    equal(controller.get('model.receivings.length'), 1, 'Clicking the new button creates a Receiving Document');
  });
});


test('Receive Save Rec', function() {
  expect(2);
  var line = fixtures.createLine(),
      model = fixtures.createReceiving(line);

  click(find(buttons.receivingEdit)[0]).then(function() {

    Ember.run(function() {
      model.send('becomeDirty');
    });

    equal(model.get('isDirty'), true, 'Record starts out dirty');
    return click(buttons.receivingRecSave);

  }).then(function() {

    equal(model.get('isDirty'), false, 'Saving the record removes dirty state');

  });
});


test('Hovering a receiving document changes the fields on the line item', function() {
  expect(3);
  var lineItem = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem),
      lineDom = find(buttons.lineItems).eq(1),
      recDom = find(buttons.receivingLines).first();

  mouseOver(recDom);

  andThen(function() {
    contains(lineDom.attr('class'), 'is-highlighted-all', 'Hovering a full receiving document updates the lines class');
    contains(lineDom.find('td.received_count').attr('class'), 'full-received', 'Hovering a partial receiving line has class partial-received');
    isVisible(lineDom.find('.received_count'), 'Hovering a receiving document shows the received count');
  });
});


test('Hovering a receiving document highlights for a partial receive', function() {
  expect(3);
  var lineItem = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 1),
      lineDom = find(buttons.lineItems).eq(1),
      recDom = find(buttons.receivingLines).first();

  mouseOver(recDom);

  andThen(function() {
    contains(lineDom.attr('class'), 'is-highlighted-partial', 'Hovering a partial receiving document updates the lines class');
    contains(lineDom.find('td.received_count').attr('class'), 'partial-received', 'Hovering a partial receiving line has class partial-received');
    isVisible(lineDom.find('.received_count'), 'Hovering a receiving document shows the received count');
  });
});


test('Hovering an over-received item highlights for over receive', function() {
  expect(3);
  var lineItem = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 6),
      lineDom = find(buttons.lineItems).eq(1),
      recDom = find(buttons.receivingLines).first();

  mouseOver(recDom);

  andThen(function() {
    contains(lineDom.attr('class'), 'is-highlighted-all', 'Hovering an over receiving document updates the lines class');
    contains(lineDom.find('td.received_count').attr('class'), 'over-received', 'Hovering an over receiving line has class over-received');
    isVisible(lineDom.find('.received_count'), 'Hovering an over receiving document shows the received count');
  });
});


test('Editing a receiving document adds buttons', function() {
  expect(1);
  var lineItem = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 1);

  click(find(buttons.receivingEdit)[0]);

  andThen(function() {
    var lineDom = find(buttons.lineItems).eq(1);
    var recButtons = lineDom.find(buttons.receivingButtons);

    isVisible(recButtons, 'The receiving buttons appear when editing');
  });
});


test('Receiving buttons can increment', function() {
  expect(2);
  var lineItem = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 1);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[1]); // Second line item since we created one

  andThen(function() {
    equal(recItem.get('receivingLines.firstObject.quantity'), '2', 'Incrementing changes the quantity to 2');
    equal(recItem.get('isDirty'), true, 'The receiving document is dirty');
  });
});


test('Receiving buttons can decrement', function() {
  expect(2);
  var lineItem = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 2);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingMinus)[1]); // Second line item since we created one

  andThen(function() {
    equal(recItem.get('receivingLines.firstObject.quantity'), '1', 'Incrementing changes the quantity to 1');
    equal(recItem.get('isDirty'), true, 'The receiving document is dirty');
  });
});


test('Receiving buttons will create a new receiving_line if one doesnt exist', function() {
  expect(2);
  var lineItem = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 2);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[0]);

  andThen(function() {
    equal(recItem.get('receivingLines.length'), 2, 'Incrementing adds a receiving_line');
    equal(recItem.get('isDirty'), true, 'The receiving document is dirty');
  });
});


test('Receive All gives an error if the line items are dirty', function() {
  expect(2);
  var model = lookups.currentModel(),
      line1 = fixtures.createLine(1, 5),
      line2 = fixtures.createLine(2, 5),
      rec = fixtures.createReceiving(line1, 2);

  myMocks.setupMockReceiveAll();

  Ember.run(function() {
    line1.send('becomeDirty');
  });

  click(buttons.receiveAll);

  andThen(function() {
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(line1.get('isDirty'), false, 'The line item is rolled back');
  });
});


test('Receive All gives an error if their are any dirty receiving documents', function() {
  expect(2);
  var model = lookups.currentModel(),
      line1 = fixtures.createLine(1, 5),
      line2 = fixtures.createLine(2, 5),
      rec = fixtures.createReceiving(line1, 2);

  myMocks.setupMockReceiveAll();

  Ember.run(function() {
    rec.send('becomeDirty');
  });

  click(buttons.receiveAll);

  andThen(function() {
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(rec.get('isDirty'), false, 'The rec is rolled back');
  });
});


test('Receive New gives an error if the line items are dirty', function() {
  expect(2);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function() {
    line.send('becomeDirty');
  });

  click(buttons.receivingNew);

  andThen(function() {
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(line.get('isDirty'), false, 'The line item is rolled back');
  });
});


test('Receive New gives an error if their are any dirty receiving documents', function() {
  expect(2);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function() {
    rec.send('becomeDirty');
  });

  click(buttons.receivingNew);

  andThen(function() {
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(rec.get('isDirty'), false, 'The rec is rolled back');
  });
});


test('Receive edit gives an error if the line items are dirty', function() {
  expect(2);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function() {
    line.send('becomeDirty');
  });

  click(find(buttons.receivingEdit)[0]);

  andThen(function() {
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(line.get('isDirty'), false, 'The line item is rolled back');
  });
});


test('Receive edit gives an error if their are any dirty receiving documents', function() {
  expect(2);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  Ember.run(function() {
    rec.send('becomeDirty');
  });

  click(find(buttons.receivingEdit)[0]);

  andThen(function() {
    contains(myMocks.alertMessage, 'Warning: there are unsaved', 'A warning message will appear');
    equal(rec.get('isDirty'), false, 'The rec is rolled back');
  });
});


test('Hovering a receiving document', function() {
  expect(2);
  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  mouseOver(find(buttons.receivingLines)[0]);
  equal(App.ReceivingGlobals.get('currentReceivingHoverDoc'), rec, 'Hovering a receiving doc sets it to currentReceivingHoverDoc');

  andThen(function() {

    mouseOut(find(buttons.receivingLines)[0]);
    equal(App.ReceivingGlobals.get('currentReceivingHoverDoc'), null, 'Un-Hovering a receiving doc clears it');

  });
});


test('Clicking a receiving document', function() {
  expect(4);
  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

  click(find(buttons.receivingEdit)[0]);

  Ember.run(function() {
    rec.send('becomeDirty');
  });

  andThen(function() {
    equal(App.ReceivingGlobals.get('currentReceivingDoc.id'), rec.id, 'Clicking a receiving doc sets it to currentReceivingDoc');

    isVisible(buttons.receivingRecSave, 'Receiving Save button appears after click');
    isVisible(buttons.receivingRecCancel, 'Receiving Cancel button appears after click');

    return click(find(buttons.receivingRecCancel));

  }).then(function() {

    equal(App.ReceivingGlobals.get('currentReceivingDoc'), null, 'Clicking cancel clears currentReceivingDoc');
  });
});
