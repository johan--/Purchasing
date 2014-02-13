
module('Purchase Edit - Delete/Cancel buttons', {
  setup: function() {

    // Build fixtures
    fixtures.injectFixtures();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/show');
  },

  teardown: function() {
  }

});


test('- Cancelled button only appears when there is a buyer', function(){
  expect(4);
  var model = lookups.currentModel();

  isVisible(buttons.purchaseEditCancel, 'The cancelled button is visible');
  equal(find(buttons.purchaseEditCancel).prop('disabled'), true, 'The cancelled button is disabled');

  Ember.run(function(){
    model.set('buyer', { id: 123, name: 'test' });
  });

  andThen(function(){
    isVisible(buttons.purchaseEditCancel, 'The cancelled button is visible');
    equal(find(buttons.purchaseEditCancel).prop('disabled'), false, 'The cancelled button is not disabled');
  });
});


test('- Cancelling an uncancelled record for Show', function() {
  expect(7);

  myMocks.addMock(App.Globals.namespace + '/purchases/1', function(data) {
    Ember.merge(data.purchase, { id: 1 });
    return data;
  });

  var model = lookups.currentModel();

  Ember.run(function(){
    model.set('buyer', { id: 123, name: 'test' });
  });

  click(buttons.purchaseEditCancel);

  andThen(function(){
    contains(myMocks.alertMessage, 'This will cancel this requisition', 'Alerts about change');
    equal(myMocks.ajaxParams.url, App.Globals.namespace + '/purchases/1', 'Sends an AJAX request to the correct URL');
    equal(myMocks.ajaxParams.type, 'PUT', 'Sends a PUT request');

    equal(isEmpty(model.get('dateCancelled')), false, 'Updates the date');
    contains(find(buttons.purchaseEditCancel).attr('class'), 'active', 'Adds the active class');
    contains(find(buttons.purchaseHeader).attr('class'), 'is-cancelled', 'Adds the cancelled class to the header');

    isHidden(buttons.receivingBox, 'The receivings box is hidden');
  });
});


test('- Cancelling an uncancelled record for Edit', function() {
  expect(4);

  myMocks.addMock(App.Globals.namespace + '/purchases/1', function(data) {
    Ember.merge(data.purchase, { id: 1 });
    return data;
  });

  var model = lookups.currentModel(),
      store = lookups.store();

  visit('/purchases/1/edit').then(function() {

    Ember.run(function(){
      store.push('purchase', { id: 1, buyer: { id: 123, name: 'test' } });
    });

    return click(buttons.purchaseEditCancel);

  }).then(function(){

    contains(myMocks.alertMessage, 'This will cancel this requisition', 'Alerts about change');
    equal(myMocks.ajaxParams.url, App.Globals.namespace + '/purchases/1', 'Sends an AJAX request to the correct URL');
    equal(myMocks.ajaxParams.type, 'PUT', 'Sends a PUT request');

    // Cannot test model / bindings because the Fixtures reset the date

    equal(lookups.path(), 'purchase.show', 'Transitions to show route');
  });
});


test('- Uncancelled a cancelled record', function() {
  expect(6);

  myMocks.addMock(App.Globals.namespace + '/purchases/1', function(data) {
    Ember.merge(data.purchase, { id: 1 });
    return data;
  });
  var model = lookups.currentModel(),
      store = lookups.store();

  Ember.run(function(){
    store.push('purchase', { id: 1, buyer: { id: 123, name: 'test' }, dateCancelled: '1/1/2014' });
  });

  click(buttons.purchaseEditCancel);

  andThen(function(){
    equal(myMocks.ajaxParams.url, App.Globals.namespace + '/purchases/1', 'Sends an AJAX request to the correct URL');
    equal(myMocks.ajaxParams.type, 'PUT', 'Sends a PUT request');

    equal(isEmpty(model.get('dateCancelled')), true, 'Clears the date');
    notContains(find(buttons.purchaseEditCancel).attr('class'), 'active', 'Removes the active class');
    notContains(find(buttons.purchaseHeader).attr('class'), 'is-cancelled', 'Removes the cancelled class to the header');

    isVisible(buttons.receivingBox, 'The receivings box is visible');  });
});


test('- Cannot create a receiving document if Cancelled', function(){
  expect(1);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      controller = lookups.controller('receivings');

  Ember.run(function() {
    controller.set('parentController', lookups.controller('purchase.show'));
    model.set('dateCancelled', '1/1/2014');

    controller.send('startEditRec', model);
  });

  andThen(function(){
    var notifications = lookups.controller('application').get('notifications');
    contains(notifications[0].message, 'Cannot receive on a cancelled', 'Abort message appears');
  });
});


test('- Cannot edit a receiving document if Cancelled', function(){
  expect(1);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      controller = lookups.controller('receivings');

  Ember.run(function() {
    controller.set('parentController', lookups.controller('purchase.show'));
    model.set('dateCancelled', '1/1/2014');

    controller.send('newReceiving');
  });

  andThen(function(){
    var notifications = lookups.controller('application').get('notifications');
    contains(notifications[0].message, 'Cannot receive on a cancelled', 'Abort message appears');
  });
});


test('- Cannot receive all if Cancelled', function(){
  expect(1);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
      controller = lookups.controller('receivings');

  Ember.run(function() {
    controller.set('parentController', lookups.controller('purchase.show'));
    model.set('dateCancelled', '1/1/2014');

    controller.send('receiveAll');
  });

  andThen(function(){
    var notifications = lookups.controller('application').get('notifications');
    contains(notifications[0].message, 'Cannot receive on a cancelled', 'Abort message appears');
  });
});


test('- Deleted button only appears when not ordered', function(){
  expect(4);

  var model = lookups.currentModel();

  isVisible(buttons.purchaseEditDelete, 'The delete button is visible');
  equal(find(buttons.purchaseEditDelete).prop('disabled'), false, 'The delete button is not disabled');

  Ember.run(function(){
    model.set('datePurchased', '1/1/2014');
  });

  andThen(function(){
    isVisible(buttons.purchaseEditDelete, 'The delete button is visible');
    equal(find(buttons.purchaseEditDelete).prop('disabled'), true, 'The delete button is disabled');
  });
});


test('- Delete button deletes record and redirects', function(){
  expect(3);
  var model = lookups.currentModel();

  click(buttons.purchaseEditDelete);

  andThen(function(){
    equal(model.get('isDeleted'), true, 'Record is flagged as deleted');
    contains(myMocks.alertMessage, 'permanently delete this record', 'A confirmation dialog exists when you try to delete the record');
    equal(lookups.path(), 'purchases.tabs', 'After deleting the user is redirected to the main purchases list');
  });
});

