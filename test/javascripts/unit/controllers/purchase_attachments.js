
module('Unit - Controllers - PurchaseAttachments', {
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


['employee', 'receiver'].forEach(function(role) {

  test('UnAssign fails with ' + role, function() {
    expect(2);
    var attachment = fixtures.createAttachment(1, true),
        controller = lookups.controller('purchaseAttachments'),
        model = lookups.currentModel();

    Ember.run(function() {
      App.Session.currentUser.set('roles', [role]);
      lookups.store().push('attachment', { id: 1, purchase_id_server: model.id });

      attachment.set('isSelected', true);
      controller.send('unassign');
    });

    andThen(function() {

      equal(attachment.get('purchase_id_server'), 1, 'The attachment is not changed');
      equal(attachment.get('isDirty'), false, 'The attachment is not dirty');

    });
  });

  test('Assign fails with ' + role, function() {
    expect(2);
    var attachment = fixtures.createAttachment(1, true),
        controller = lookups.controller('purchaseAttachments'),
        model = lookups.currentModel();

    Ember.run(function() {
      App.Session.currentUser.set('roles', [role]);

      attachment.set('isSelected', true);
      controller.send('assign');
    });

    andThen(function() {

      equal(attachment.get('purchase_id_server'), null, 'The attachment is not changed');
      equal(attachment.get('isDirty'), false, 'The attachment is not dirty');

    });
  });
});


test('Opening attachments window clears selected attachments', function() {
  expect(1);
  var attachment = fixtures.createAttachment(1, true);

  Ember.run(function() {
    attachment.set('isSelected', true);
  });

  click(buttons.purchaseEditAttachments);

  andThen(function() {

    equal(attachment.get('isSelected'), false, 'The attachment is not selected');

  });
});


test('Closing attachments window clears selected attachments', function() {
  expect(1);
  var attachment = fixtures.createAttachment(1, true);

  click(buttons.purchaseEditAttachments);

  Ember.run(function() {
    attachment.set('isSelected', true);
  });

  click(buttons.modalBackground);

  andThen(function() {

    equal(attachment.get('isSelected'), false, 'The attachment is not selected');

  });
});

// Attachment delete / upload rollback
