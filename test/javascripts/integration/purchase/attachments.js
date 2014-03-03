
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
  expect(2);
  var attachment = fixtures.createAttachment(1, true);

  click(buttons.purchaseEditAttachments);
  click(buttons.attachment).then(function() {

    isVisible(buttons.purchaseAttachmentControls, 'Selecting a record and the controls are visible');
    return click(buttons.purchaseAttachmentControlsClear);

  }).then(function() {

    isHidden(buttons.purchaseAttachmentControls, 'Clearing the selectiong and the controls are not visible');

  });
});


test('Clicking assign works with Other', function() {
  expect(4);
  var attachment = fixtures.createAttachment(1, true),
      model = lookups.currentModel();

  click(buttons.purchaseEditAttachments);
  click(buttons.attachment);
  click(buttons.purchaseAttachmentControlsAssign);

  andThen(function() {
    equal(attachment.get('purchase_id_server'), model.id, 'The attachment is assigned to the purchase');
    equal(attachment.get('category'), null, 'The category is empty');
    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'The item is moved to the assigned window');
    equal(find(buttons.purchaseAttachmentsUnAssigned).length, 0, 'The unassigned window is empty');
  });
});


test('Clicking assign works with Requisition', function() {
  expect(4);
  var attachment = fixtures.createAttachment(1, true),
      model = lookups.currentModel();

  click(buttons.purchaseEditAttachments);
  click(buttons.attachment);
  click(buttons.purchaseAttachmentTabRequisition);
  click(buttons.purchaseAttachmentControlsAssign);

  andThen(function() {
    equal(attachment.get('purchase_id_server'), model.id, 'The attachment is assigned to the purchase');
    equal(attachment.get('category'), 'Requisition', 'The category is set to Requisition');
    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'The item is moved to the assigned window');
    equal(find(buttons.purchaseAttachmentsUnAssigned).length, 0, 'The unassigned window is empty');
  });
});


test('Clicking unassign works', function() {
  expect(4);
  var attachment = fixtures.createAttachment(1, true),
      model = lookups.currentModel();

  Ember.run(function() {
    lookups.store().push('attachment', { id: 1, purchase_id_server: model.id });
  });

  click(buttons.purchaseEditAttachments);
  click(buttons.attachment);
  click(buttons.purchaseAttachmentControlsUnAssign);

  andThen(function() {
    equal(attachment.get('purchase_id_server'), null, 'The attachment is unassigned from the purchase');
    equal(attachment.get('category'), null, 'The category is set to null');
    equal(find(buttons.purchaseAttachmentsAssigned).length, 0, 'The assigned window is empty');
    equal(find(buttons.purchaseAttachmentsUnAssigned).length, 1, 'The item is moved to the unassigned window');
  });
});


test("Drop on Assigned", function() {
  expect(9);
  var store = lookups.store(),
      parent = lookups.controller('purchase.edit'),
      controller = lookups.controller('purchaseAttachments');

  myMocks.addMock(App.getUrl('/attachments?purchase_id=1'), function(data) {
    return { attachment: { id: 55, purchase_id_server: parent.get('id') } };
  });

  Ember.run(function() {
    controller.set('parentController', parent);
  });

  var view = App.PurchaseAttachmentsList.extend({
      controller: controller,
      includePurchase: true }).create();

  var mockFile = { lastModifiedDate: '1/1/2014', name: 'file.txt' },
      payload = { dataTransfer: { files: [ mockFile ] },
                  preventDefault: function() {},
                  stopPropagation: function() {} };

  click(buttons.purchaseEditAttachments);

  Ember.run(function() {
    view.drop(payload, $());
  });

  lookups.currentRoute().refresh();

  andThen(function() {
    var attachments = store.all('attachment').get('content'),
        newAttachment = attachments.get('lastObject');

    equal(attachments.length, 1, 'There is only one attachment in the store');

    equal(myMocks.ajaxParams.type, 'POST', 'A POST message is sent');
    equal(myMocks.ajaxParams.url, App.getUrl('/attachments?purchase_id=1'), 'The correct url is called');

    equal(newAttachment.get('isDirty'), false, 'The new attachment is not dirty');
    equal(newAttachment.id, 55, 'The new attachment has the correct ID');
    equal(newAttachment.get('category'), null, 'The new attachment has the correct category');
    equal(newAttachment.get('purchase_id_server'), parent.get('id'), 'The new attachment is related to the purchase');

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'The assigned window has one item');
    equal(find(buttons.purchaseAttachmentsUnAssigned).length, 0, 'The unassigned window is empty');
  });
});


test("Drop on category", function() {
  expect(9);
  var store = lookups.store(),
      parent = lookups.controller('purchase.edit'),
      controller = lookups.controller('purchaseAttachments');

  myMocks.addMock(App.getUrl('/attachments?category=Requisition&purchase_id=1'), function(data) {
    return { attachment: { id: 55, purchase_id_server: parent.get('id'), category: 'Requisition' } };
  });

  Ember.run(function() {
    controller.set('parentController', parent);
  });

  var view = App.AttachmentCategoryView.extend({
      controller: controller,
      category: 'Requisition' }).create();

  var mockFile = { lastModifiedDate: '1/1/2014', name: 'file.txt' },
      payload = { dataTransfer: { files: [ mockFile ] },
                  preventDefault: function() {},
                  stopPropagation: function() {} };

  click(buttons.purchaseEditAttachments);
  click(buttons.purchaseAttachmentTabRequisition);

  Ember.run(function() {
    view.drop(payload, $());
  });

  lookups.currentRoute().refresh();

  andThen(function() {
    var attachments = store.all('attachment').get('content'),
        newAttachment = attachments.get('lastObject');

    equal(attachments.length, 1, 'There is only one attachment in the store');

    equal(myMocks.ajaxParams.type, 'POST', 'A POST message is sent');
    equal(myMocks.ajaxParams.url, App.getUrl('/attachments?category=Requisition&purchase_id=1'), 'The correct url is called');

    equal(newAttachment.get('isDirty'), false, 'The new attachment is not dirty');
    equal(newAttachment.id, 55, 'The new attachment has the correct ID');
    equal(newAttachment.get('category'), 'Requisition', 'The new attachment has the correct category');
    equal(newAttachment.get('purchase_id_server'), parent.get('id'), 'The new attachment is related to the purchase');

    equal(find(buttons.purchaseAttachmentsAssigned).length, 1, 'The assigned window has one item');
    equal(find(buttons.purchaseAttachmentsUnAssigned).length, 0, 'The unassigned window is empty');
  });
});



test("Drop on unassigned", function() {
  expect(9);
  var store = lookups.store(),
      parent = lookups.controller('purchase.edit'),
      controller = lookups.controller('purchaseAttachments');

  myMocks.addMock(App.getUrl('/attachments?'), function(data) {
    return { attachment: { id: 55 } };
  });

  Ember.run(function() {
    controller.set('parentController', parent);
  });

  var view = App.PurchaseAttachmentsList.extend({
      controller: controller }).create();

  var mockFile = { lastModifiedDate: '1/1/2014', name: 'file.txt' },
      payload = { dataTransfer: { files: [ mockFile ] },
                  preventDefault: function() {},
                  stopPropagation: function() {} };

  click(buttons.purchaseEditAttachments);

  Ember.run(function() {
    view.drop(payload, $());
  });

  lookups.currentRoute().refresh();

  andThen(function() {
    var attachments = store.all('attachment').get('content'),
        newAttachment = attachments.get('lastObject');

    equal(attachments.length, 1, 'There is only one attachment in the store');

    equal(myMocks.ajaxParams.type, 'POST', 'A POST message is sent');
    equal(myMocks.ajaxParams.url, App.getUrl('/attachments?'), 'The correct url is called');

    equal(newAttachment.get('isDirty'), false, 'The new attachment is not dirty');
    equal(newAttachment.id, 55, 'The new attachment has the correct ID');
    equal(newAttachment.get('category'), null, 'The new attachment has the correct category');
    equal(newAttachment.get('purchase_id_server'), null, 'The new attachment is not related to the purchase');

    equal(find(buttons.purchaseAttachmentsAssigned).length, 0, 'The assigned window is empty');
    equal(find(buttons.purchaseAttachmentsUnAssigned).length, 1, 'The unassigned window has one item');
  });
});


test('Attachment actions are not available if is loading', function() {
  expect(1);
  visit('/attachments');

  var attachment = fixtures.createAttachment(1, true);

  Ember.run(function() {
    attachment.send('becomeDirty');
  });

  andThen(function() {

    var el = find(buttons.attachment).eq(0);
    notExists(buttons.attachmentHover, 'The hover element is not visible');

  });
});


test('Assign/unassign buttons are hidden if an attachment is still being processed', function() {
  expect(3);
  var attachment = fixtures.createAttachment(1, true);

  Ember.run(function() {
    attachment.send('becomeDirty');
  });

  click(buttons.purchaseEditAttachments);
  click(buttons.attachment);
  click(buttons.purchaseAttachmentTabRequisition);

  andThen(function() {

    isHidden(buttons.purchaseAttachmentControls, 'The attachment controls are hidden');
    equal(attachment.get('purchase_id_server'), null, 'The attachment purchase_id is not changed');
    equal(attachment.get('category'), null, 'The attachments category is not changed');

  });
});
