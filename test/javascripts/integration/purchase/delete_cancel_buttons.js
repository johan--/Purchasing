
module('Integration - Purchase - Delete/Cancel buttons', {
  setup: function() {

    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/show');
  },

  teardown: function() {
  }

});


test('Canceled button only appears when record is purchased', function() {
  expect(2);
  var model = lookups.currentModel();

  isHidden(buttons.purchaseEditCancel, 'The canceled button is hidden');

  Ember.run(function() {
    model.set('datePurchased', '1/1/2014');
  });

  andThen(function() {
    isVisible(buttons.purchaseEditCancel, 'The canceled button is visible');
  });
});


test('Canceling an uncanceled record for Show', function() {
  expect(7);
  fixtures.updateOneFixture('purchase', 1, { datePurchased: '1/1/2014' });

  myMocks.addMock(App.getUrl('/purchases/1'), function(data) {
    Ember.merge(data.purchase, { id: 1, date_purchased: '1/1/2014', date_canceled: '1/1/2014' });
    return data;
  });

  click(buttons.purchaseEditCancel);

  andThen(function() {
    var model = lookups.currentModel();

    contains(myMocks.alertMessage, 'This will cancel this requisition', 'Alerts about change');
    equal(myMocks.ajaxParams.url, App.getUrl('/purchases/1'), 'Sends an AJAX request to the correct URL');
    equal(myMocks.ajaxParams.type, 'PUT', 'Sends a PUT request');

    equal(isEmpty(model.get('dateCanceled')), false, 'Updates the date');
    contains(find(buttons.purchaseEditCancel).attr('class'), 'active', 'Adds the active class');
    contains(find(buttons.purchaseHeader).attr('class'), 'is-canceled', 'Adds the canceled class to the header');

    isHidden(buttons.receivingBox, 'The receivings box is hidden');

  });
});


test('Canceling an uncanceled record for Edit', function() {
  expect(4);
  visit('/purchases/1/edit').then(function() {

    fixtures.updateOneFixture(App.Purchase, 1, { datePurchased: '1/1/2014' });

    myMocks.addMock(App.getUrl('/purchases/1'), function(data) {
      Ember.merge(data.purchase, { id: 1, date_purchased: '1/1/2014', date_canceled: '1/1/2014' });
      return data;
    });

    return click(buttons.purchaseEditCancel);

  }).then(function() {
    var model = lookups.currentModel(),
        store = lookups.store();

    contains(myMocks.alertMessage, 'This will cancel this requisition', 'Alerts about change');
    equal(myMocks.ajaxParams.url, App.getUrl('/purchases/1'), 'Sends an AJAX request to the correct URL');
    equal(myMocks.ajaxParams.type, 'PUT', 'Sends a PUT request');

    equal(lookups.path(), 'purchase.show', 'Transitions to show route');
  });
});


test('Uncancel a canceled record', function() {
  expect(6);

  myMocks.addMock(App.getUrl('/purchases/1'), function(data) {
    Ember.merge(data.purchase, { id: 1, date_purchased: '1/1/2014', date_canceled: null,
                                 purchase_type: 'materials' });
    return data;
  });
  var model = lookups.currentModel(),
      store = lookups.store();

  fixtures.updateOneFixture(App.Purchase, 1, { datePurchased: '1/1/2014', dateCanceled: '1/1/2014' });

  click(buttons.purchaseEditCancel);

  andThen(function() {
    equal(myMocks.ajaxParams.url, App.getUrl('/purchases/1'), 'Sends an AJAX request to the correct URL');
    equal(myMocks.ajaxParams.type, 'PUT', 'Sends a PUT request');

    equal(isEmpty(model.get('dateCanceled')), true, 'Clears the date');

    notContains(find(buttons.purchaseEditCancel).attr('class'), 'active', 'Removes the active class');
    notContains(find(buttons.purchaseHeader).attr('class'), 'is-canceled', 'Removes the canceled class to the header');

    isVisible(buttons.receivingBox, 'The receivings box is visible');
  });
});


test('Cannot create a receiving document if Canceled', function() {
  expect(1);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      controller = lookups.controller('receivings');

  Ember.run(function() {
    controller.set('parentController', lookups.controller('purchase.show'));
    model.set('dateCanceled', '1/1/2014');

    controller.send('startEditRec', model);
  });

  andThen(function() {
    var notifications = lookups.controller('application').get('notifications');
    contains(notifications[0].message, 'Cannot receive on a canceled', 'Abort message appears');
  });
});


test('Cannot edit a receiving document if Canceled', function() {
  expect(1);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      controller = lookups.controller('receivings');

  Ember.run(function() {
    controller.set('parentController', lookups.controller('purchase.show'));
    model.set('dateCanceled', '1/1/2014');

    controller.send('newReceiving');
  });

  andThen(function() {
    var notifications = lookups.controller('application').get('notifications');
    contains(notifications[0].message, 'Cannot receive on a canceled', 'Abort message appears');
  });
});


test('Cannot receive all if Canceled', function() {
  expect(1);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      controller = lookups.controller('receivings');

  Ember.run(function() {
    controller.set('parentController', lookups.controller('purchase.show'));
    model.set('dateCanceled', '1/1/2014');

    controller.send('receiveAll');
  });

  andThen(function() {
    var notifications = lookups.controller('application').get('notifications');
    contains(notifications[0].message, 'Cannot receive on a canceled', 'Abort message appears');
  });
});


test('Deleted button only appears when not ordered', function() {
  expect(2);

  var model = lookups.currentModel();

  isVisible(buttons.purchaseEditDelete, 'The delete button is visible');

  Ember.run(function() {
    model.set('datePurchased', '1/1/2014');
  });

  andThen(function() {
    isHidden(buttons.purchaseEditDelete, 'The delete button is hidden');
  });
});


test('Delete button deletes record and redirects', function() {
  expect(3);
  var model = lookups.currentModel();

  click(buttons.purchaseEditDelete);

  andThen(function() {
    equal(model.get('isDeleted'), true, 'Record is flagged as deleted');
    contains(myMocks.alertMessage, 'permanently delete this record', 'A confirmation dialog exists when you try to delete the record');
    equal(lookups.path(), 'purchases.tabs', 'After deleting the user is redirected to the main purchases list');
  });
});


