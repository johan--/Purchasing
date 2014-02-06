
module('LineItems', {
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


test('A created line item has a dom element', function(){
  expect(1);
  fixtures.createLine();

  andThen(function(){
    equal(find(buttons.lineItems).length, 2, 'Creating a line item adds a dom element');
  });
});


test('AddNewLineObjects defaults to one new line and note', function(){
  expect(2);
  var model = currentModel();

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
    var model = currentModel();
    equal(model.get('lineItems.length'), 2, 'New line is added after adding one');
  });
});


test('Clicking delete on a line item', function(){
  expect(3);
  click(find(buttons.lineDelete));

  var deleted = currentModel().get('lineItems.firstObject.isDestroy'),
      lineDom = find(buttons.lineItems).first(),
      lineDesc = find(buttons.lineDescription).first();

  andThen(function(){
    equal(deleted, true, 'Clicking the delete button on a line item flags the isDestroy flag');
    equal(lineDesc.attr('disabled'), 'disabled', 'CLicking the delete button disabled the input');
    contains(lineDom.first().attr('class'), 'is-deleted', 'Clicking the delete button will add the is-deleted class to the row');
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
