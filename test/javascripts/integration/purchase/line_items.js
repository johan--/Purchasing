
module('LineItems', {
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
  },

  teardown: function() {
  }

});

test('A created line item has a dom element', function(){
  visit('/purchases/1/edit').then(function(){
    helperMethods.createLine();

    andThen(function(){
      equal(find(buttons.lineItems).length, 2, 'Creating a line item adds a dom element');
    });
  });
});

test('AddNewLineObjects defaults to one new line and note', function(){
  visit('/purchases/1/edit');

  andThen(function(){
    var model = helperMethods.model('purchase');
    equal(model.get('lineItems.length'), 1, 'One line item is added');
    equal(model.get('notes.length'), 1, 'One note is added');
  });
});

test('Adding a new lineItems item', function(){
  visit('/purchases/1/edit').then(function(){
    var el = find(buttons.lineDescription)[0];

    click(el);
    fillIn(el, 'Test Description');
    focusOut(el);

    andThen(function(){
      var model = helperMethods.model('purchase');
      equal(model.get('lineItems.length'), 2, 'New line is added after adding one');
    });
  });
});

test('Clicking delete on a line item', function(){
  visit('/purchases/1/edit').then(function(){
    click(find(buttons.lineDelete));
    var deleted = helperMethods.model('purchase').get('lineItems.firstObject.isDestroy');
    var lineDom = find(buttons.lineItems).first();
    var lineDesc = find(buttons.lineDescription).first();

    andThen(function(){
      equal(deleted, true, 'Clicking the delete button on a line item flags the isDestroy flag');
      equal(lineDesc.attr('disabled'), 'disabled', 'CLicking the delete button disabled the input');
      contains(lineDom.first().attr('class'), 'is-deleted', 'Clicking the delete button will add the is-deleted class to the row');
    });
  });
});

test('Hovering a receiving document changes the fields on the line item', function(){
  visit('/purchases/1/edit').then(function(){
    var lineItem = helperMethods.createLine(),
        recItem = helperMethods.createReceiving(lineItem);
    var lineDom = find(buttons.lineItems).eq(1),
        recDom = find(buttons.receivingLines).first();

    mouseOver(recDom);

    andThen(function(){
      contains(lineDom.attr('class'), 'is-highlighted-all', 'Hovering a full receiving document updates the lines class');
      contains(lineDom.find('td>.received_count').attr('class'), 'full-received', 'Hovering a partial receiving line has class partial-received');
      isVisible(lineDom.find('.received_count'), 'Hovering a receiving document shows the received count');
    });
  });
});

test('Hovering a receiving document highlights for a partial receive', function(){
  visit('/purchases/1/edit').then(function(){
    var lineItem = helperMethods.createLine(),
        recItem = helperMethods.createReceiving(lineItem, 1);
    var lineDom = find(buttons.lineItems).eq(1),
        recDom = find(buttons.receivingLines).first();

    mouseOver(recDom);

    andThen(function(){
      contains(lineDom.attr('class'), 'is-highlighted-partial', 'Hovering a partial receiving document updates the lines class');
      contains(lineDom.find('td>.received_count').attr('class'), 'partial-received', 'Hovering a partial receiving line has class partial-received');
      isVisible(lineDom.find('.received_count'), 'Hovering a receiving document shows the received count');
    });
  });
});

test('Hovering an overreceived ite highlights for over receive', function(){
  visit('/purchases/1/edit').then(function(){
    var lineItem = helperMethods.createLine(),
        recItem = helperMethods.createReceiving(lineItem, 1);
    var lineDom = find(buttons.lineItems).eq(1),
        recDom = find(buttons.receivingLines).first();

    mouseOver(recDom);

    andThen(function(){
      contains(lineDom.attr('class'), 'is-highlighted-partial', 'Hovering an over receiving document updates the lines class');
      contains(lineDom.find('td>.received_count').attr('class'), 'over-received', 'Hovering an over receiving line has class over-received');
      isVisible(lineDom.find('.received_count'), 'Hovering an over receiving document shows the received count');
    });
  });
});

test('Editing a receiving document adds buttons', function(){
  visit('/purchases/1/edit').then(function(){
    var lineItem = helperMethods.createLine(),
        recItem = helperMethods.createReceiving(lineItem, 1);

    return wait();
  }).then(function(){

    return click(find(buttons.receivingEdit)[0]);
  }).then(function(){
    var lineDom = find(buttons.lineItems).eq(1);
    var buttons = lineDom.find(buttons.receivingButtons);

    equal(visible(buttons), true, 'The receiving buttons appear when editing');
  });
});
