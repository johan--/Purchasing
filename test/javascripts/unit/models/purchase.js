
module('Unit - Models - Purchase', {
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


test('TaxRateDisplay mirrors tax_rate', function(){
  expect(1);
  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('tax_rate', '%10.0');
  });

  andThen(function(){
    equal(model.get('taxRateDisplay'), model.get('tax_rate'), 'The model mirrors the display value');
  });
});


test('TaxRateDisplay defaults to %0.0', function(){
  expect(1);
  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('tax_rate', null);
  });

  andThen(function(){
    equal(model.get('taxRateDisplay'), '%0.0', 'An empty tax_rate displays %0.0');
  });
});


test('Computed property received - No receiving docs', function(){
  expect(3);
  var model = lookups.currentModel();

  // No line items
  equal(model.get('receivedInternal'), false, 'Initially it is false');

  // One line item with no quantity
  var line = fixtures.createLine();
  equal(model.get('receivedInternal'), false, 'With an empty line item its false');

  // One line item with a quantity
  Ember.run(function(){
    line.set('quantity', 5);
  });

  andThen(function(){
    equal(model.get('receivedInternal'), false, 'With a non-empty line item its false');
  });
});


test('Computed property received - One receiving but empty', function(){
  expect(1);
  var model = lookups.currentModel();

  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      recLine = rec.get('receivingLines.firstObject');

  Ember.run(function(){
    recLine.set('quantity', 0);
  });

  andThen(function(){
    equal(model.get('receivedInternal'), false, 'With an empty receiving doc its false');
  });
});


test('Computed property received - One receiving with less quantity', function(){
  expect(1);
  var model = lookups.currentModel();

  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line, 0),
      recLine = rec.get('receivingLines.firstObject');

  Ember.run(function(){
    recLine.set('quantity', 2);
  });

  andThen(function(){
    equal(model.get('receivedInternal'), false, 'With partial receive its still false');
  });
});


test('Computed property received - One receiving complete', function(){
  expect(1);
  var model = lookups.currentModel();

  var line = fixtures.createLine(null, 5),
      rec = fixtures.createReceiving(line, 5);

  andThen(function(){
    equal(model.get('receivedInternal'), true, 'With all received it is true');
  });
});


test('Computed property received - Over received', function(){
  expect(1);
  var model = lookups.currentModel();

  var line = fixtures.createLine(null, 5),
      rec = fixtures.createReceiving(line, 6);

  andThen(function(){
    equal(model.get('receivedInternal'), true, 'With all received it is true');
  });
});


test('Computed property received - Two line items, one received one half', function(){
  expect(1);
  var model = lookups.currentModel();

  var line1 = fixtures.createLine(null, 5),
      line2 = fixtures.createLine(null, 5),
      rec1 = fixtures.createReceiving(line1, 5),
      rec2 = fixtures.createReceiving(line2, 4);

  andThen(function(){
    equal(model.get('receivedInternal'), false, 'With one received and one not it is false');
  });
});


test('Computed property received - Two line items, one received one over', function(){
  expect(1);
  var model = lookups.currentModel();

  var line1 = fixtures.createLine(null, 5),
      line2 = fixtures.createLine(null, 5),
      rec1 = fixtures.createReceiving(line1, 5),
      rec2 = fixtures.createReceiving(line2, 6);

  andThen(function(){
    equal(model.get('receivedInternal'), true, 'With one received and one over it is true');
  });
});


test('Computed property received - Two line items, both received', function(){
  expect(1);
  var model = lookups.currentModel();

  var line1 = fixtures.createLine(null, 5),
      line2 = fixtures.createLine(null, 5),
      rec1 = fixtures.createReceiving(line1, 5),
      rec2 = fixtures.createReceiving(line2, 5);

  andThen(function(){
    equal(model.get('receivedInternal'), true, 'With two received it is true');
  });
});


test('new_attachments is updated correctly', function() {
  expect(6);
  var model = lookups.currentModel();

  Ember.run(function() {
    model.set('id', null);
  });

  equal(model.get('new_attachments'), null, 'With no attachments it is null');

  fixtures.createAttachment(1);
  equal(model.get('new_attachments').length, 1, 'Returns an array with one item');
  equal(model.get('new_attachments')[0], '1', 'ID is correct');

  fixtures.createAttachment(2);
  equal(model.get('new_attachments').length, 2, 'Returns an array with two items');
  equal(model.get('new_attachments')[0], '1', 'First ID is correct');
  equal(model.get('new_attachments')[1], '2', 'Second ID is correct');
});


test('new_attachments is not observed if there is an id', function() {
  expect(1);
  var model = lookups.currentModel(),
      attachment = fixtures.createAttachment();

  equal(model.get('new_attachments'), null, 'With no attachments it is null');
});


test('Computed property received', function() {
  expect(8);
  var model = lookups.currentModel(),
      store = lookups.store(),
      rec = null,
      line = null;

  Ember.run(function() {
    model.set('received_server', true);
  });

  // Default value is server value
  equal(model.get('receivedInternal'), false, 'Scenario 1: receivedInternal is null');
  equal(model.get('received'), true, 'Scenario 1: received is true');


  Ember.run(function() {
    line = fixtures.createLine();
    rec = fixtures.createReceiving(line, 3);
  });
  // There is a receiving document, but it is not final
  equal(model.get('receivedInternal'), false, 'Scenario 2: receivedInternal is false');
  equal(model.get('received'), false, 'Scenario 2: received is false');


  Ember.run(function() {
    rec = rec.get('receivingLines.firstObject').set('quantity', 5);
  });
  // There is a receiving document and it is final
  equal(model.get('receivedInternal'), true, 'Scenario 3: receivedInternal is true');
  equal(model.get('received'), true, 'Scenario 3: received is true');


  // Received is updated then rolled back, everything reverts to false
  Ember.run(function() {
    rec.destroyRecord();
    model.rollbackWithChildren();
  });


  andThen(function() {
    equal(model.get('receivedInternal'), false, 'Scenario 4: receivedInternal is false');
    equal(model.get('received'), false, 'Scenario 4: received is false');
  });
});
