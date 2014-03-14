
module('Integration - Purchase - Email', {
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


test('To Validation', function() {
  expect(2);
  click(buttons.purchaseEditEmail);

  contains(find(buttons.emailTo).parent().attr('class'), 'has-error', 'Initially, the TO field has an error');
  fillIn(buttons.emailTo, 'person@someplace.org');

  andThen(function() {

    notContains(find(buttons.emailTo).parent().attr('class'), 'has-error', 'Finally, the TO field does not have an error');

  });
});


test('Subject Validation', function() {
  expect(2);
  contains(find(buttons.emailSubject).parent().attr('class'), 'has-error', 'Initially, the Subject field has an error');
  fillIn(buttons.emailSubject, 'A subject');

  andThen(function() {

    notContains(find(buttons.emailSubject).parent().attr('class'), 'has-error', 'Finally, the Subject field does not have an error');

  });
});


test('Body Validation', function() {
  expect(2);
  contains(find(buttons.emailBody).parent().attr('class'), 'has-error', 'Initially, the Body field has an error');
  fillIn(buttons.emailBody, 'An email!');

  andThen(function() {

    notContains(find(buttons.emailBody).parent().attr('class'), 'has-error', 'Finally, the Body field does not have an error');

  });
});


test('If server does not return 200, window stays open', function() {
  expect(2);

  myMocks.addMock(App.getUrl('/purchases/1/email'), function(data) {
    return 'There was an error sending your email';
  }, 'error');

  click(buttons.purchaseEditEmail);
  fillIn(buttons.emailTo, 'person@someplace.org');
  fillIn(buttons.emailSubject, 'A subject!');
  fillIn(buttons.emailBody, 'An email!');

  click(buttons.submitEmail);

  andThen(function() {

    var app = lookups.controller('application');

    contains(app.get('notifications')[0].message, 'There was an error', 'The error notification is created');
    isVisible(buttons.emailModal, 'The email modal stays open');

  });
});
