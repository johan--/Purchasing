var attachment = null, controller = null;

module('Unit - Controllers - Attachment', {
  setup: function() {
    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build an instance of attachment controller
    var store = lookups.store(),
        container = store.container;

    attachment = fixtures.createAttachment(1, true);
    controller = lookups.controller('attachment');

    Ember.run(function() {
      controller.set('content', attachment);
    });
  },

  teardown: function() {
    // Visiting any route takes care of some final cleanup
    visit('/attachments');
  }
});


test('titleText', function() {
  expect(4);

  Ember.run(function() {
    attachment.set('attachment_file_name', 'filename');
    attachment.set('attachment_content_type', 'pdf');
    attachment.set('attachment_file_size', '500');
    attachment.set('created_at', 'Jan 1 5:00 AM');
  });

  var title = controller.get('titleText');

  contains(title, 'filename', 'Filename is included');
  contains(title, 'pdf', 'Content Type is included');
  contains(title, '500', 'Size is included');
  contains(title, 'Jan 1 5:00 AM', 'Created At is included');
});


test('progressAmountStyle', function() {
  expect(3);

  attachment.set('progressAmount', 50);
  equal(controller.get('progressAmountStyle'), 'width: 50%', 'Binding between progress amount and its style');

  attachment.set('progressAmount', 0);
  equal(controller.get('progressAmountStyle'), 'width: 0%', 'Binding between progress amount and its style');

  attachment.set('progressAmount', null);
  equal(controller.get('progressAmountStyle'), 'width: 0%', 'Binding between progress amount and its style');
});


test('progressText', function() {
  expect(4);

  attachment.set('progressAmount', 50);
  equal(controller.get('progressText'), '50%', 'Binding between progress amount and its style at 50%');

  attachment.set('progressAmount', 0);
  equal(controller.get('progressText'), '0%', 'Binding between progress amount and its style at 0%');

  attachment.set('progressAmount', 100);
  equal(controller.get('progressText'), 'Processing...', 'Binding between progress amount and its style at 100%');

  attachment.set('progressAmount', null);
  equal(controller.get('progressText'), 'Saving...', 'Binding between progress amount and its style at null');
});

// testing updateCategoryAndPurchase is causing problems
