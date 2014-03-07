
module('Unit - Controllers - Purchase/Email', {
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


test('Opening email window clears selected attachments', function() {
  expect(1);
  var model = lookups.currentModel(),
      attachment = fixtures.createAttachment(1);

  Ember.run(function() {
    attachment.set('isSelected', true);
  });

  click(buttons.purchaseEditEmail);

  andThen(function() {

    equal(attachment.get('isSelected'), false, 'The attachment is not selected');

  });
});


test('Closing email window clears selected attachments', function() {
  expect(1);
  var model = lookups.currentModel(),
      attachment = fixtures.createAttachment(1);

  click(buttons.purchaseEditEmail);

  Ember.run(function() {
    attachment.set('isSelected', true);
  });

  click(buttons.modalBackground);

  andThen(function() {

    equal(attachment.get('isSelected'), false, 'The attachment is not selected');

  });
});


test('Opening email window selects any requisition attachments', function() {
  expect(2);
  var model = lookups.currentModel(),
      attachment1 = fixtures.createAttachment(1),
      attachment2 = fixtures.createAttachment(2);

  Ember.run(function() {
    attachment2.set('category', 'Requisition');
  });

  click(buttons.purchaseEditEmail);

  andThen(function() {

    equal(attachment1.get('isSelected'), false, 'The first attachment is not selected');
    equal(attachment2.get('isSelected'), true, 'The second attachment is selected');

  });
});


test('Email window shows correct buttons', function() {
  expect(3);
  var model = lookups.currentModel(),
      attachment1 = fixtures.createAttachment(1),
      attachment2 = fixtures.createAttachment(2);

  click(buttons.purchaseEditEmail);

  andThen(function() {

    exists(find(buttons.emailModal).find(buttons.attachmentPreview), 'The preview buttons does exist');
    exists(find(buttons.emailModal).find(buttons.attachmentDownload), 'The download buttons does exist');
    notExists(find(buttons.emailModal).find(buttons.attachmentDelete), 'The delete buttons do not exist');

  });
});
