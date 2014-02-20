
module('Integration - Purchase - Attachments', {
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


test('Clicking the attachments button opens the modal', function() {
  expect(1);

  click(buttons.purchaseEditAttachments);

  andThen(function() {
    isVisible(buttons.purchaseAttachmentsModal, 'The modal is visible');
  });
});


test('Bindings for assigned/unassigned attachments', function() {
  expect(8);
  var attachment1 = fixtures.createAttachment(1, true),
      attachment2 = fixtures.createAttachment(2, true),
      model = lookups.currentModel();

  click(buttons.purchaseEditAttachments);
  equal(find(buttons.purchaseAttachmentsAssigned).length, 0, '1) there are no assigned items');
  equal(find(buttons.purchaseAttachmentsUnAssigned).length, 2, '1) there are two unassigned items');

  Ember.run(function() {
    attachment1.set('purchase_id_server', model.id);
  });
  equal(find(buttons.purchaseAttachmentsAssigned).length, 1, '2) there is one assigned item');
  equal(find(buttons.purchaseAttachmentsUnAssigned).length, 1, '2) there is one unassigned item');

  Ember.run(function() {
    attachment2.set('purchase_id_server', model.id);
  });
  equal(find(buttons.purchaseAttachmentsAssigned).length, 2, '4) there are two assigned items');
  equal(find(buttons.purchaseAttachmentsUnAssigned).length, 0, '4) there are no unassigned items');

  Ember.run(function() {
    attachment1.set('purchase_id_server', null);
    attachment2.set('purchase_id_server', null);
  });

  equal(find(buttons.purchaseAttachmentsAssigned).length, 0, '5) there are no assigned items');
  equal(find(buttons.purchaseAttachmentsUnAssigned).length, 2, '5) there are two unassigned items');
});


test('Tab observers', function() {
  expect(12);

  var attachment = fixtures.createAttachment(1, true),
      model = lookups.currentModel();
  click(buttons.purchaseEditAttachments);

  Ember.run(function() {
    attachment.set('purchase_id_server', model.id);
  });

  click(buttons.purchaseAttachmentTabOther).then(function() {

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'There is one item assigned to Other with null');

    Ember.run(function() { attachment.set('category', 'Other'); });
    return click(buttons.purchaseAttachmentTabOther);

  }).then(function() {

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'There is one item assigned to Other');

    Ember.run(function() { attachment.set('category', 'Requisition'); });
    equal(find(buttons.purchaseAttachmentsAssigned).length, 0, 'There are no items assigned to Other');
    return click(buttons.purchaseAttachmentTabRequisition);

  }).then(function() {

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'There is one item assigned to Requisition');

    Ember.run(function() { attachment.set('category', 'Confirmation'); });
    equal(find(buttons.purchaseAttachmentsAssigned).length, 0, 'There are no items assigned to Requisition');
    return click(buttons.purchaseAttachmentTabConfirmation);

  }).then(function() {

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'There is one item assigned to Requisition');

    Ember.run(function() { attachment.set('category', 'Packing List'); });
    equal(find(buttons.purchaseAttachmentsAssigned).length, 0, 'There are no items assigned to Requisition');
    return click(buttons.purchaseAttachmentTabPackingList);

  }).then(function() {

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'There is one item assigned to Packing List');

    Ember.run(function() { attachment.set('category', 'Invoice'); });
    equal(find(buttons.purchaseAttachmentsAssigned).length, 0, 'There are no items assigned to Packing List');
    return click(buttons.purchaseAttachmentTabInvoice);

  }).then(function() {

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'There is one item assigned to Invoice');

    Ember.run(function() { attachment.set('category', 'Return'); });
    equal(find(buttons.purchaseAttachmentsAssigned).length, 0, 'There are no items assigned to Invoice');
    return click(buttons.purchaseAttachmentTabReturn);

  }).then(function() {

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'There is one item assigned to Return');

  });
});


test('Select/unselect of an attachment', function() {
  var attachment = fixtures.createAttachment(1, true);
  click(buttons.purchaseEditAttachments);

  click(buttons.attachment).then(function() {

    isVisible(buttons.purchaseAttachmentControls, 'Selecting a record and the controls are visible');
    return click(buttons.purchaseAttachmentControlsClear);

  }).then(function() {

    isHidden(buttons.purchaseAttachmentControls, 'Clearing the selectiong and the controls are not visible');

  });
});


// Unassigned > assigned works
// Assigned > unassigned works

// Assign/unassign fails for non-buyers
// Assign/unassign will fail if an attachment is still being processed

// Simulate drop on category
// Simulate drop on assigned
// Simulate drop on unassigned
