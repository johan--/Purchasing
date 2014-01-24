
module('LineItems', {
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

test('A created line item has a dom element', function(){
  expect(1);
  helperMethods.createLine();

  andThen(function(){
    equal(find(buttons.lineItems).length, 2, 'Creating a line item adds a dom element');
  });
});

test('AddNewLineObjects defaults to one new line and note', function(){
  expect(2);
  var model = helperMethods.model('purchase');

  equal(model.get('lineItems.length'), 1, 'One line item is added');
  equal(model.get('notes.length'), 1, 'One note is added');
});

test('Adding a new lineItems item', function(){
  expect(1);
  var el = find(buttons.lineDescription)[0];

  click(el);
  fillIn(el, 'Test Description');
  focusOut(el);

  andThen(function(){
    var model = helperMethods.model('purchase');
    equal(model.get('lineItems.length'), 2, 'New line is added after adding one');
  });
});

test('Clicking delete on a line item', function(){
  expect(3);
  click(find(buttons.lineDelete));

  var deleted = helperMethods.model('purchase').get('lineItems.firstObject.isDestroy'),
      lineDom = find(buttons.lineItems).first(),
      lineDesc = find(buttons.lineDescription).first();

  andThen(function(){
    equal(deleted, true, 'Clicking the delete button on a line item flags the isDestroy flag');
    equal(lineDesc.attr('disabled'), 'disabled', 'CLicking the delete button disabled the input');
    contains(lineDom.first().attr('class'), 'is-deleted', 'Clicking the delete button will add the is-deleted class to the row');
  });
});

test('Hovering a receiving document changes the fields on the line item', function(){
  expect(3);
  var lineItem = helperMethods.createLine(),
      recItem = helperMethods.createReceiving(lineItem),
      lineDom = find(buttons.lineItems).eq(1),
      recDom = find(buttons.receivingLines).first();

  mouseOver(recDom);

  andThen(function(){
    contains(lineDom.attr('class'), 'is-highlighted-all', 'Hovering a full receiving document updates the lines class');
    contains(lineDom.find('td.received_count').attr('class'), 'full-received', 'Hovering a partial receiving line has class partial-received');
    isVisible(lineDom.find('.received_count'), 'Hovering a receiving document shows the received count');
  });
});

test('Hovering a receiving document highlights for a partial receive', function(){
  expect(3);
  var lineItem = helperMethods.createLine(),
      recItem = helperMethods.createReceiving(lineItem, 1),
      lineDom = find(buttons.lineItems).eq(1),
      recDom = find(buttons.receivingLines).first();

  mouseOver(recDom);

  andThen(function(){
    contains(lineDom.attr('class'), 'is-highlighted-partial', 'Hovering a partial receiving document updates the lines class');
    contains(lineDom.find('td.received_count').attr('class'), 'partial-received', 'Hovering a partial receiving line has class partial-received');
    isVisible(lineDom.find('.received_count'), 'Hovering a receiving document shows the received count');
  });
});

test('Hovering an over-received item highlights for over receive', function(){
  expect(3);
  var lineItem = helperMethods.createLine(),
      recItem = helperMethods.createReceiving(lineItem, 6),
      lineDom = find(buttons.lineItems).eq(1),
      recDom = find(buttons.receivingLines).first();

  mouseOver(recDom);

  andThen(function(){
    contains(lineDom.attr('class'), 'is-highlighted-all', 'Hovering an over receiving document updates the lines class');
    contains(lineDom.find('td.received_count').attr('class'), 'over-received', 'Hovering an over receiving line has class over-received');
    isVisible(lineDom.find('.received_count'), 'Hovering an over receiving document shows the received count');
  });
});

test('Editing a receiving document adds buttons', function(){
  expect(1);
  var lineItem = helperMethods.createLine(),
      recItem = helperMethods.createReceiving(lineItem, 1);

  click(find(buttons.receivingEdit)[0]);

  andThen(function(){
    var lineDom = find(buttons.lineItems).eq(1);
    var recButtons = lineDom.find(buttons.receivingButtons);

    isVisible(recButtons, 'The receiving buttons appear when editing');
  });
});

test('Receiving buttons can increment', function(){
  expect(1);
  var lineItem = helperMethods.createLine(),
      recItem = helperMethods.createReceiving(lineItem, 1);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[1]); // Second line item since we created one

  andThen(function(){
    equal(recItem.get('receivingLines.firstObject.quantity'), '2', 'Incrementing changes the quantity to 2');
  });
});

test('Receiving buttons can decrement', function(){
  expect(1);
  var lineItem = helperMethods.createLine(),
      recItem = helperMethods.createReceiving(lineItem, 2);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingMinus)[1]); // Second line item since we created one

  andThen(function(){
    equal(recItem.get('receivingLines.firstObject.quantity'), '1', 'Incrementing changes the quantity to 1');
  });
});

test('Receiving buttons will create a new receiving_line if one doesnt exist', function(){
  expect(1);
  var lineItem = helperMethods.createLine(),
      recItem = helperMethods.createReceiving(lineItem, 2);

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[0]);

  andThen(function(){
    equal(recItem.get('receivingLines.length'), 2, 'Incrementing adds a receiving_line');
  });
});


test('Empty description & quantity', function() {
  expect(2);

  notContains(find(buttons.lineDescription).parent().attr('class'), 'has-error', 'With both empty no errors are shown');
  notContains(find(buttons.lineQuantity).parent().attr('class'), 'has-error', 'With both empty no errors are shown');
});

test('Empty description validation', function() {
  expect(1);
  fillIn(find(buttons.lineQuantity), '25');

  andThen(function(){
    contains(find(buttons.lineDescription).parent().attr('class'), 'has-error', 'An empty descrition is error');
  });
});

test('Empty quantity validation', function() {
  expect(1);
  fillIn(find(buttons.lineDescription), 'Test description');

  andThen(function(){
    contains(find(buttons.lineQuantity).parent().attr('class'), 'has-error', 'An empty descrition is error');
  });
});
