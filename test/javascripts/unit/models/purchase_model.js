
module('PurchaseModel', {
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


test('TaxRateDisplay mirrors tax_rate', function(){
  expect(1);
  var model = currentModel();

  Ember.run(function(){
    model.set('tax_rate', '%10.0');
  });

  andThen(function(){
    equal(model.get('taxRateDisplay'), model.get('tax_rate'), 'The model mirrors the display value');
  });
});


test('TaxRateDisplay defaults to %0.0', function(){
  expect(1);
  var model = currentModel();

  Ember.run(function(){
    model.set('tax_rate', null);
  });

  andThen(function(){
    equal(model.get('taxRateDisplay'), '%0.0', 'An empty tax_rate displays %0.0');
  });
});


test('- Computed property received - No receiving docs', function(){
  var model = currentModel();

  // No line items
  equal(model.get('received'), false, 'Initially it is false');

  // One line item with no quantity
  var line = fixtures.createLine();
  equal(model.get('received'), false, 'With an empty line item its false');

  // One line item with a quantity
  Ember.run(function(){
    line.set('quantity', 5);
  });

  andThen(function(){
    equal(model.get('received'), false, 'With a non-empty line item its false');
  });
});


test('- Computed property received - One receiving but empty', function(){
  var model = currentModel();

  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      recLine = rec.get('receivingLines.firstObject');

  Ember.run(function(){
    recLine.set('quantity', 0);
  });

  andThen(function(){
    equal(model.get('received'), false, 'With an empty receiving doc its false');
  });
});


test('- Computed property received - One receiving with less quantity', function(){
  var model = currentModel();

  var line = fixtures.createLine(),
      rec = fixtures.createReceiving(line, 0),
      recLine = rec.get('receivingLines.firstObject');

  Ember.run(function(){
    recLine.set('quantity', 2);
  });

  andThen(function(){
    equal(model.get('received'), false, 'With partial receive its still false');
  });
});


test('- Computed property received - One receiving complete', function(){
  var model = currentModel();

  var line = fixtures.createLine(null, 5),
      rec = fixtures.createReceiving(line, 5);

  andThen(function(){
    equal(model.get('received'), true, 'With all received it is true');
  });
});


test('- Computed property received - Over received', function(){
  var model = currentModel();

  var line = fixtures.createLine(null, 5),
      rec = fixtures.createReceiving(line, 6);

  andThen(function(){
    equal(model.get('received'), true, 'With all received it is true');
  });
});


test('- Computed property received - Two line items, one received one half', function(){
  var model = currentModel();

  var line1 = fixtures.createLine(null, 5),
      line2 = fixtures.createLine(null, 5),
      rec1 = fixtures.createReceiving(line1, 5),
      rec2 = fixtures.createReceiving(line2, 4);

  andThen(function(){
    equal(model.get('received'), false, 'With one received and one not it is false');
  });
});


test('- Computed property received - Two line items, one received one over', function(){
  var model = currentModel();

  var line1 = fixtures.createLine(null, 5),
      line2 = fixtures.createLine(null, 5),
      rec1 = fixtures.createReceiving(line1, 5),
      rec2 = fixtures.createReceiving(line2, 6);

  andThen(function(){
    equal(model.get('received'), true, 'With one received and one over it is true');
  });
});


test('- Computed property received - Two line items, both received', function(){
  var model = currentModel();

  var line1 = fixtures.createLine(null, 5),
      line2 = fixtures.createLine(null, 5),
      rec1 = fixtures.createReceiving(line1, 5),
      rec2 = fixtures.createReceiving(line2, 5);

  andThen(function(){
    equal(model.get('received'), true, 'With two received it is true');
  });
});
