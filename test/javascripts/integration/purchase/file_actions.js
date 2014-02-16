
module('Integration - Purchase - File Actions', {
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


test('Printing if record is Dirty', function() {
  expect(2);
  var model = lookups.currentModel();

  Ember.run(function() {
    model.send('becomeDirty');
  });

  click(buttons.purchaseEditPrint);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), true, 'There is an alert message');
    equal(myMocks.url, '/api/1.0/purchases/1', 'The correct url is sent');
  });
});


test('Printing if record is not Dirty', function() {
  expect(2);
  var model = lookups.currentModel();

  click(buttons.purchaseEditPrint);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), false, 'There is not an alert message');
    equal(myMocks.url, '/api/1.0/purchases/1', 'The correct url is sent');
  });
});


test('Saving if record is Dirty', function() {
  expect(2);
  var model = lookups.currentModel();

  Ember.run(function() {
    model.send('becomeDirty');
  });

  click(buttons.purchaseEditSavePDF);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), true, 'There is an alert message');
    equal(myMocks.url, '/api/1.0/purchases/1.pdf', 'The correct url is sent');
  });
});


test('Saving if record is not Dirty', function() {
  expect(2);
  var model = lookups.currentModel();

  click(buttons.purchaseEditSavePDF);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), false, 'There is not an alert message');
    equal(myMocks.url, '/api/1.0/purchases/1.pdf', 'The correct url is sent');
  });
});


test('Emailing if record is Dirty', function() {
  expect(1);
  var model = lookups.currentModel();

  Ember.run(function() {
    model.send('becomeDirty');
  });

  click(buttons.purchaseEditEmail);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), true, 'There is an alert message');
  });
});


test('Emailing if record is not Dirty', function() {
  expect(1);
  var model = lookups.currentModel();

  click(buttons.purchaseEditEmail);

  andThen(function(){
    equal(!isEmpty(myMocks.alertMessage), false, 'There is not an alert message');
  });
});
