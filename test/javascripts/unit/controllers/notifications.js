
module('Unit - Controllers - Notifications', {
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


test('Sending a single notice creates a notification', function() {
  expect(3);
  var controller = lookups.controller('application');

  Ember.run(function() {
    controller.notify({ message: 'test', type: 'notification' });
  });

  andThen(function() {
    var notices = controller.get('notifications');

    equal(Ember.typeOf(notices), 'array', 'Notices is an array');
    equal(notices[0].message, 'test', 'The message is successfully sent to notices');
    equal(notices.length, 1, 'There is only one message');
  });
});


test('Sending a notice clears existing notifications', function() {
  expect(2);
  var controller = lookups.controller('application');

  Ember.run(function() {
    controller.set('notifications', [{ message: 'an old message', type: 'error' }]);
    controller.notify({ message: 'test', type: 'notification' });
  });

  andThen(function() {
    var notices = controller.get('notifications');

    equal(notices[0].message, 'test', 'The message is successfully sent to notices');
    equal(notices.length, 1, 'There is only one message');
  });
});


test('Sending an error creates the appropriate notification', function() {
  expect(2);
  var controller = lookups.controller('application');

  Ember.run(function() {
    controller.notify({ message: 'test', type: 'error' });
  });

  andThen(function() {
    var notices = controller.get('notifications');

    equal(notices[0].message, 'test', 'The message is successfully sent to notices');
    equal(notices[0].className, 'alert-danger', 'The class is set for an error');
  });
});


test('Sending a notice creates the appropriate notification', function() {
  expect(2);
  var controller = lookups.controller('application');

  Ember.run(function() {
    controller.notify({ message: 'test', type: 'notice' });
  });

  andThen(function() {
    var notices = controller.get('notifications');

    equal(notices[0].message, 'test', 'The message is successfully sent to notices');
    equal(notices[0].className, 'alert-success', 'The class is set for an notice');
  });
});


test('Sending an array of notices creates multiple notifications', function() {
  expect(3);
  var controller = lookups.controller('application');

  Ember.run(function() {
    controller.notify([ { message: 'test', type: 'notice' },
                        { message: 'test2', type: 'error' } ]);
  });

  andThen(function() {
    var notices = controller.get('notifications');

    equal(notices.length, 2, 'There are two messages');
    equal(notices[0].message, 'test', 'The first message was successfully sent to notices');
    equal(notices[1].message, 'test2', 'The second message was successfully sent to notices');
  });
});


test('Sending a message that is a responseJSON object', function() {
  expect(4);
  var controller = lookups.controller('application');

  Ember.run(function() {
    controller.notify({ responseJSON: { 'purchase' : 'test' } });
  });

  andThen(function() {
    var notices = controller.get('notifications');

    equal(notices.length, 1, 'There is one message');
    equal(notices[0].message, 'Purchase: test', 'The first message was successfully sent to notices');
    equal(notices[0].className, 'alert-danger', 'The correct class is set');
    equal(notices[0].type, 'error', 'The default type is set');
  });
});


test('Sending a message that is a responseJSON object with a non-default Type', function() {
  expect(2);
  var controller = lookups.controller('application');

  Ember.run(function() {
    controller.notify({ responseJSON: { 'purchase' : 'test' } }, 'notice');
  });

  andThen(function() {
    var notices = controller.get('notifications');

    equal(notices[0].className, 'alert-success', 'The correct class is set');
    equal(notices[0].type, 'notice', 'The correct type is set');
  });
});


test('Sending a message that is a responseText object', function() {
  expect(4);
  var controller = lookups.controller('application');

  Ember.run(function() {
    controller.notify({ responseText: 'test' });
  });

  andThen(function() {
    var notices = controller.get('notifications');

    equal(notices.length, 1, 'There is one message');
    equal(notices[0].message, 'test', 'The first message was successfully sent to notices');
    equal(notices[0].className, 'alert-danger', 'The correct class is set');
    equal(notices[0].type, 'error', 'The default type is set');
  });
});
