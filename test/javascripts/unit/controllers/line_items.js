
module('Unit - Controllers - Line Items', {
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


test('Creating a receiving_line from line_item buttons matches the ID of both the line_item and edited receiving_doc', function() {
  // This is only testing the relationships between records that have ID's
  expect(2);

  var lineItem = fixtures.createLine(),
      lineItem2 = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 2);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[2]);

  andThen(function() {
    var rec_line = lookups.currentModel().get('receivings.firstObject.receivingLines.lastObject');

    equal(rec_line.get('lineItem.id'), lineItem2.id, 'Created receiving_line builds a relationship with line_item');
    equal(rec_line.get('receiving.id'), recItem.id, 'Created receiving_line builds a relationship with line_item');
  });
});


test('Step increment when received is < quantity by 10', function() {
  expect(1);
  var lineItem = fixtures.createLine(null, 15),
      lineItem2 = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 2);

  click(find(buttons.receivingEdit)[0]).then(function() {

    var el = find(buttons.receivingPlus).eq(1);

    Ember.run(function() {
      mouseDown(el);

      Ember.run.later(this, function() {
        mouseUp(el);
      }, 1200); // This should tick at least 3 times
    });

    return wait();

  }).then(function() {

    equal(lineItem.get('receivedCount'), 15, 'The increment does not go over');

  });
});


test('Step increment when received is < quantity by 5', function() {
  expect(1);
  var lineItem = fixtures.createLine(null, 3),
      lineItem2 = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 2);

  click(find(buttons.receivingEdit)[0]).then(function() {

    var el = find(buttons.receivingPlus).eq(1);

    Ember.run(function() {
      mouseDown(el);

      Ember.run.later(this, function() {
        mouseUp(el);
      }, 1200); // This should tick at least 3 times
    });

    return wait();

  }).then(function() {

    equal(lineItem.get('receivedCount'), 3, 'The increment does not go over');

  });
});


test('Step increment when received is = quantity', function() {
  expect(1);
  var lineItem = fixtures.createLine(null, 15),
      lineItem2 = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem);

  click(find(buttons.receivingEdit)[0]).then(function() {

    var el = find(buttons.receivingPlus).eq(1);

    Ember.run(function() {
      mouseDown(el);

      Ember.run.later(this, function() {
        mouseUp(el);
      }, 1200); // This should tick at least 3 times
    });

    return wait();

  }).then(function() {

    equal(lineItem.get('receivedCount'), 15, 'The increment does not go over');

  });
});


test('Step increment when received is > quantity', function() {
  expect(1);
  var lineItem = fixtures.createLine(null, 15),
      lineItem2 = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 25);

  click(find(buttons.receivingEdit)[0]).then(function() {

    var el = find(buttons.receivingPlus).eq(1);

    Ember.run(function() {
      mouseDown(el);

      Ember.run.later(this, function() {
        mouseUp(el);
      }, 1200); // This should tick at least 3 times
    });

    return wait();

  }).then(function() {

    equal(lineItem.get('receivedCount'), 25, 'The increment does not go over');

  });
});


test('Step decrement when received is > 0', function() {
  expect(1);
  var lineItem = fixtures.createLine(null, 15),
      lineItem2 = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 5);

  click(find(buttons.receivingEdit)[0]).then(function() {

    var el = find(buttons.receivingMinus).eq(1);

    Ember.run(function() {
      mouseDown(el);

      Ember.run.later(this, function() {
        mouseUp(el);
      }, 1200); // This should tick at least 3 times
    });

    return wait();

  }).then(function() {

    equal(lineItem.get('receivedCount'), 0, 'The increment does not go over');

  });
});


test('Step decrement when received is = 0', function() {
  expect(1);
  var lineItem = fixtures.createLine(null, 15),
      lineItem2 = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, 0);

  click(find(buttons.receivingEdit)[0]).then(function() {

    var el = find(buttons.receivingMinus).eq(1);

    Ember.run(function() {
      mouseDown(el);

      Ember.run.later(this, function() {
        mouseUp(el);
      }, 1200); // This should tick at least 3 times
    });

    return wait();

  }).then(function() {

    equal(lineItem.get('receivedCount'), 0, 'The increment does not go over');

  });
});


test('Step decrement when received is = -1', function() {
  expect(1);
  var lineItem = fixtures.createLine(null, 15),
      lineItem2 = fixtures.createLine(),
      recItem = fixtures.createReceiving(lineItem, -2);

  click(find(buttons.receivingEdit)[0]).then(function() {

    var el = find(buttons.receivingMinus).eq(1);

    Ember.run(function() {
      mouseDown(el);

      Ember.run.later(this, function() {
        mouseUp(el);
      }, 1200); // This should tick at least 3 times
    });

    return wait();

  }).then(function() {

    equal(lineItem.get('receivedCount'), -2, 'The increment does not go over');

  });
});

