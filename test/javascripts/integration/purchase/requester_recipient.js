
module('Requester/Recipient', {
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
    visit('/purchases/1/edit');
  },

  teardown: function() {
    $('.token-input-dropdown').remove();
    $('.token-input-dropdown-large').remove();
    visit('/purchases/1/show');
  }

});


test('Requester field reflects model', function(){
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();
    Ember.run(function(){
      model.set('requester', { id: 123, name: 'a test person' });
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    return click(buttons.purchaseRequesterTab);

  }).then(function(){
    var model = helperMethods.model(),
        requester = find(buttons.purchaseRequesterTab),
        recipient = find(buttons.purchaseRecipientTab),
        modelName = model.get('requester.name'),
        domName = find(buttons.purchasePersonNameToken).text().trim(); // Will have extra characters

    contains(domName, modelName, 'DOM reflects requester name in model');
    contains(requester.parent().attr('class'), 'active', 'The Requester tab is active');
    notContains(recipient.parent().attr('class'), 'active', 'The Recipient tab is not active');
  });
});


test('Recipient field reflects model', function(){
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();
    Ember.run(function(){
      model.set('recipient', { id: 123, name: 'a test person' });
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    return click(buttons.purchaseRecipientTab);

  }).then(function(){
    var model = helperMethods.model(),
        requester = find(buttons.purchaseRequesterTab),
        recipient = find(buttons.purchaseRecipientTab),
        modelName = model.get('recipient.name'),
        domName = find(buttons.purchasePersonNameToken).text().trim(); // Will have extra characters

    contains(domName, modelName, 'DOM reflects recipient name in model');
    notContains(requester.parent().attr('class'), 'active', 'The Requester tab is not active');
    contains(recipient.parent().attr('class'), 'active', 'The Recipient tab is active');
  });
});


test('Deleting a requester affects the model', function(){
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();
    Ember.run(function(){
      model.set('requester', { id: 123, name: 'a test person' });
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    return click(buttons.purchasePersonTokenDelete);

  }).then(function(){
    var model = helperMethods.model();

    equal(model.get('requester'), null, 'Deleting the requester token updates the model');
    equal(model.get('isDirty'), true, 'Deleting the requester token flags the model as dirty');
  });
});


test('Deleting a recipient affects the model', function(){
  visit('/purchases/1/show').then(function(){

    var model = helperMethods.model();
    Ember.run(function(){
      model.set('recipient', { id: 123, name: 'a test person' });
    });

    return visit('/purchases/1/edit');

  }).then(function(){

    click(buttons.purchaseRecipientTab);
    return click(buttons.purchasePersonTokenDelete);

  }).then(function(){
    var model = helperMethods.model();

    equal(model.get('recipient'), null, 'Deleting the recipient token updates the model');
    equal(model.get('isDirty'), true, 'Deleting the recipient token flags the model as dirty');
  });
});


test('Adding a requester updates a blank recipient', function(){
  var requester = find('.purchase_requester_tokens'),
      recipient = find('.purchase_recipient_tokens'),
      model = helperMethods.model();

  Ember.run(function(){
    requester.tokenInput('add', { 'id': 123, 'name': 'testing'});
  });

  andThen(function(){
    equal(model.get('requester.name'), 'testing', 'Setting a token updates the model');
    equal(model.get('recipient.name'), 'testing', 'Setting the requester updates a blank recipient');
  });
});


test('Adding a requester does not update a non-blank recipient', function(){
  var requester = find('.purchase_requester_tokens'),
      recipient = find('.purchase_recipient_tokens'),
      model = helperMethods.model();

  Ember.run(function(){
    recipient.tokenInput('add', { 'id': 123, 'name': 'test'});
    requester.tokenInput('add', { 'id': 124, 'name': 'testing'});
  });

  andThen(function(){
    equal(model.get('requester.name'), 'testing', 'Setting a token updates the model');
    equal(model.get('recipient.name'), 'test', 'Setting the requester does not update a non-blank recipient');
  });
});


test('Adding a recipient without a requester does nothing', function(){
  var requester = find('.purchase_requester_tokens'),
      recipient = find('.purchase_recipient_tokens'),
      model = helperMethods.model();

  Ember.run(function(){
    recipient.tokenInput('add', { 'id': 123, 'name': 'test'});
  });

  andThen(function(){
    equal(model.get('requester.name'), null, 'Setting a recipient doesnt affect a blank requester');
    equal(model.get('recipient.name'), 'test', 'Setting the recipient updates the model');
  });
});


test('Adding a recipient with a requester does nothing', function(){
  var requester = find('.purchase_requester_tokens'),
      recipient = find('.purchase_recipient_tokens'),
      model = helperMethods.model();

  Ember.run(function(){
    requester.tokenInput('add', { 'id': 123, 'name': 'testing'});
    recipient.tokenInput('add', { 'id': 124, 'name': 'test'});
  });

  andThen(function(){
    equal(model.get('requester.name'), 'testing', 'Setting a recipient doesnt affect a blank requester');
    equal(model.get('recipient.name'), 'test', 'Setting the recipient updates the model');
  });
});
