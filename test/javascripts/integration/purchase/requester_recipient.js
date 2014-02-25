// For these tests, you only need to mock the ajax response if you are testing that portion
// of the process.  Otherwise, add a token with an ID # and no ajax request will be fired

module('Integration - Purchase - Requester/Recipient', {
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


test('Requester field reflects model', function() {
  expect(3);
  fixtures.updateOneFixture('purchase', 1, { requester: { id: 5, displayname: 'a test person' } });

  visit('/purchases/1/show');
  visit('/purchases/1/edit');

  click(buttons.purchaseRequesterTab);

  andThen(function() {
    var model = lookups.currentModel(),
        requester = find(buttons.purchaseRequesterTab),
        recipient = find(buttons.purchaseRecipientTab),
        modelName = model.get('requester.displayname'),
        domName = find(buttons.purchasePersonNameToken).text().trim(); // Will have extra characters

    contains(domName, modelName, 'DOM reflects requester name in model');
    contains(requester.parent().attr('class'), 'active', 'The Requester tab is active');
    notContains(recipient.parent().attr('class'), 'active', 'The Recipient tab is not active');
  });
});


test('Recipient field reflects model', function() {
  expect(3);
  fixtures.updateOneFixture('purchase', 1, { recipient: { id: 5, displayname: 'a test person' } });

  visit('/purchases/1/show');
  visit('/purchases/1/edit');

  click(buttons.purchaseRecipientTab);

  andThen(function() {
    var model = lookups.currentModel(),
        requester = find(buttons.purchaseRequesterTab),
        recipient = find(buttons.purchaseRecipientTab),
        modelName = model.get('recipient.displayname'),
        domName = find(buttons.purchasePersonNameToken).text().trim(); // Will have extra characters

    contains(domName, modelName, 'DOM reflects recipient name in model');
    notContains(requester.parent().attr('class'), 'active', 'The Requester tab is not active');
    contains(recipient.parent().attr('class'), 'active', 'The Recipient tab is active');
  });
});


test('Deleting a requester affects the model', function() {
  expect(2);
  fixtures.updateOneFixture('purchase', 1, { requester: { name: 'a test person' } });

  visit('/purchases/1/show');
  visit('/purchases/1/edit');
  click(buttons.purchasePersonTokenDelete);

  andThen(function() {
    var model = lookups.currentModel();

    equal(model.get('requester'), null, 'Deleting the requester token updates the model');
    equal(model.get('isDirty'), true, 'Deleting the requester token flags the model as dirty');
  });
});


test('Deleting a recipient affects the model', function() {
  expect(2);
  fixtures.updateOneFixture('purchase', 1, { recipient: { name: 'a test person' } });

  visit('/purchases/1/show');
  visit('/purchases/1/edit');
  click(buttons.purchasePersonTokenDelete);

  andThen(function() {
    var model = lookups.currentModel();

    equal(model.get('recipient'), null, 'Deleting the recipient token updates the model');
    equal(model.get('isDirty'), true, 'Deleting the recipient token flags the model as dirty');
  });
});


test('Adding a requester updates a blank recipient', function() {
  expect(2);
  var requester = find('.purchase_requester_tokens'),
      recipient = find('.purchase_recipient_tokens'),
      model = lookups.currentModel();

  Ember.run(function() {
    requester.tokenInput('add', { 'id': 24, 'name': 'testing'});
  });

  andThen(function() {
    equal(model.get('requester.name'), 'testing', 'Setting a token updates the model');
    equal(model.get('recipient.name'), 'testing', 'Setting the requester updates a blank recipient');
  });
});


test('Adding a requester does not update a non-blank recipient', function() {
  expect(2);
  var requester = find('.purchase_requester_tokens'),
      recipient = find('.purchase_recipient_tokens'),
      model = lookups.currentModel();

  Ember.run(function() {
    recipient.tokenInput('add', { 'id': 24, 'name': 'test'});
    requester.tokenInput('add', { 'id': 25, 'name': 'testing'});
  });

  andThen(function() {
    equal(model.get('requester.name'), 'testing', 'Setting a token updates the model');
    equal(model.get('recipient.name'), 'test', 'Setting the requester does not update a non-blank recipient');
  });
});


test('Adding a recipient without a requester does nothing', function() {
  expect(2);
  var requester = find('.purchase_requester_tokens'),
      recipient = find('.purchase_recipient_tokens'),
      model = lookups.currentModel();

  Ember.run(function() {
    recipient.tokenInput('add', { 'id': 25, 'name': 'test'});
  });

  andThen(function() {
    equal(model.get('requester.name'), null, 'Setting a recipient doesnt affect a blank requester');
    equal(model.get('recipient.name'), 'test', 'Setting the recipient updates the model');
  });
});


test('Adding a recipient with a requester does nothing', function() {
  expect(2);
  var requester = find('.purchase_requester_tokens'),
      recipient = find('.purchase_recipient_tokens'),
      model = lookups.currentModel();

  Ember.run(function() {
    requester.tokenInput('add', { 'id': 1, 'name': 'testing'});
    recipient.tokenInput('add', { 'id': 2, 'name': 'test'});
  });

  wait();

  andThen(function() {
    equal(model.get('requester.name'), 'testing', 'Setting a recipient doesnt affect a requester');
    equal(model.get('recipient.name'), 'test', 'Setting the recipient updates the model');
  });
});


test('Adding a requester sends an AJAX request', function() {
  expect(6);
  var requester = find('.purchase_requester_tokens');

  myMocks.addMock(App.getUrl('/users/account_tokens'), function(data) {
    return { user: { id: 52 },
             accounts: [{ id: 2, number: '123456-123456-12345'}, { id: 4, number: '555555-444444-33333'}] };
  });

  Ember.run(function() {
    requester.tokenInput('add', { 'netid': 'user123', 'displayname': 'testing', 'email': 'test@test.edu'});
  });

  andThen(function() {

    equal(myMocks.ajaxParams.method, 'POST', 'Sends a get request');
    equal(myMocks.ajaxParams.url, App.getUrl('/users/account_tokens'), 'Sends a request to /accounts');

    equal(!isEmpty(myMocks.ajaxParams.data.user), true, 'Sends the user object');
    equal(myMocks.ajaxParams.data.user.netid, 'user123', 'Sends the username');
    equal(myMocks.ajaxParams.data.user.displayname, 'testing', 'Sends the user name');
    equal(myMocks.ajaxParams.data.user.email, 'test@test.edu', 'Sends the user email');

  });
});


test('Pushes accounts from server', function() {
  expect(5);
  var requester = find('.purchase_requester_tokens'),
      model = lookups.currentModel(),
      store = lookups.store();

  myMocks.addMock(App.getUrl('/users/account_tokens'), function(data) {
    return { user: { id: 52 },
             accounts: [{ id: 2, number: '123456-123456-12345'}, { id: 4, number: '555555-444444-33333'}] };
  });

  Ember.run(function() {
    requester.tokenInput('add', { 'name': 'testing' });
  });

  wait();

  andThen(function() {
    var accounts = store.all('account').get('content');
    equal(accounts.length, 2, 'There are two accounts in the store');
    equal(accounts.get('firstObject').id, 2, 'The first account has the correct ID');
    equal(accounts.get('firstObject.number'), '123456-123456-12345', 'The first account has the correct number');
    equal(accounts.get('lastObject').id, 4, 'The second account has the correct ID');
    equal(accounts.get('lastObject.number'), '555555-444444-33333', 'The second account has the correct number');
  });
});


test('Updates requester token with server data', function() {
  expect(5);
  var requester = find('.purchase_requester_tokens'),
      model = lookups.currentModel(),
      store = lookups.store();

  myMocks.addMock(App.getUrl('/users/account_tokens'), function(data) {
    return { user: { id: 52, name: 'another test user', email: 'another_test@test.edu' },
             accounts: [] };
  });

  Ember.run(function() {
    requester.tokenInput('add', { netid: 52, displayname: 'testing', 'email': 'test@test.edu'});
  });

  wait();

  andThen(function() {
    equal(model.get('requester.id'), 52, 'The requester id is sent');
    equal(model.get('requester.name'), 'another test user', 'The requester name is sent');
    equal(model.get('requester.email'), 'another_test@test.edu', 'The requester email is sent');
    equal(myMocks.numCalls, 1, 'There is only one ajax call');

    equal(model.get('recipient.id'), 52, 'The recipient received the new token');
  });
});

test('Updates recipient token with server data', function() {
  expect(5);
  var recipient = find('.purchase_recipient_tokens'),
      model = lookups.currentModel(),
      store = lookups.store();

  myMocks.addMock(App.getUrl('/users/account_tokens'), function(data) {
    return { user: { id: 52, name: 'another test user', email: 'another_test@test.edu' },
             accounts: [] };
  });

  Ember.run(function() {
    recipient.tokenInput('add', { netid: 52, displayname: 'testing', 'email': 'test@test.edu'});
  });

  wait();

  andThen(function() {
    equal(model.get('recipient.id'), 52, 'The recipient id is sent');
    equal(model.get('recipient.name'), 'another test user', 'The recipient name is sent');
    equal(model.get('recipient.email'), 'another_test@test.edu', 'The recipient email is sent');
    equal(myMocks.numCalls, 1, 'There is only one ajax call');

    equal(model.get('requester'), null, 'The requester is unchanged');
  });
});
