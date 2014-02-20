
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
      App.current_user.set('roles', [role]);
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
      App.current_user.set('roles', [role]);

      attachment.set('isSelected', true);
      controller.send('assign');
    });

    andThen(function() {
      equal(attachment.get('purchase_id_server'), null, 'The attachment is not changed');
      equal(attachment.get('isDirty'), false, 'The attachment is not dirty');
    });
  });

});


test('Assign/unassign will fail if an attachment is still being processed', function() {
  expect(2);
  var attachment = fixtures.createAttachment(1, true);

  Ember.run(function() {
    attachment.send('becomeDirty');
  });

  click(buttons.purchaseEditAttachments);
  click(buttons.attachment);
  click(buttons.purchaseAttachmentTabRequisition);
  click(buttons.purchaseAttachmentControlsAssign);

  andThen(function() {
    equal(attachment.get('purchase_id_server'), null, 'The attachment purchase_id is not changed');
    equal(attachment.get('category'), null, 'The attachments category is not changed');
  });
});


test('Assign/unassign will fail if an attachment is still being processed (isDirty)', function() {
  expect(2);
  var attachment = fixtures.createAttachment(1, true);

  Ember.run(function() {
    attachment.send('becomeDirty');
  });

  click(buttons.purchaseEditAttachments);
  click(buttons.attachment);
  click(buttons.purchaseAttachmentTabRequisition);
  click(buttons.purchaseAttachmentControlsAssign);

  andThen(function() {
    equal(attachment.get('purchase_id_server'), null, 'The attachment purchase_id is not changed');
    equal(attachment.get('category'), null, 'The attachments category is not changed');
  });
});


test('Assign/unassign will fail if an attachment is still being processed (progressAmount)', function() {
  expect(2);
  var attachment = fixtures.createAttachment(1, true);

  Ember.run(function() {
    attachment.set('progressAmount', 10);
  });

  click(buttons.purchaseEditAttachments);
  click(buttons.attachment);
  click(buttons.purchaseAttachmentTabRequisition);
  click(buttons.purchaseAttachmentControlsAssign);

  andThen(function() {
    equal(attachment.get('purchase_id_server'), null, 'The attachment purchase_id is not changed');
    equal(attachment.get('category'), null, 'The attachments category is not changed');
  });
});
