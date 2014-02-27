
module('Integration - Attachments - Main', {
  setup: function() {

    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/attachments');
  },

  teardown: function() {
  }

});


test('Only unassigned attachments are shown', function() {
  expect(6);
  var attachment1 = fixtures.createAttachment(1, true),
      controller = lookups.controller('attachments');

  equal(controller.get('filteredContent.length'), 1, 'Initially there is one attachment');
  equal(find(buttons.attachment).length, 1, 'There is one attachment in the DOM');

  var attachment2 = fixtures.createAttachment(2, true);
  equal(controller.get('filteredContent.length'), 2, 'Then there are two attachments');
  equal(find(buttons.attachment).length, 2, 'There are two attachments in the DOM');

  Ember.run(function() {
    attachment1.set('purchase_id_server', 55);
  });

  equal(controller.get('filteredContent.length'), 1, 'After assigning one, then there is one left');
  equal(find(buttons.attachment).length, 1, 'There is one attachment in the DOM');
});


test('Attachment selection / action buttons', function() {
  expect(13);
  var attachment = fixtures.createAttachment(1, true);

  notExists(buttons.attachmentsUnselect, 'The unselect button does not exist');
  notExists(buttons.attachmentsNew, 'The new record button does not exist');
  notExists(buttons.attachmentsMaterials, 'The materials toggle does not exist');
  notExists(buttons.attachmentsServices, 'The services toggle does not exist');

  click(find(buttons.attachment).eq(0));

  equal(attachment.get('isSelected'), true, 'The model is flagged as selected');
  contains(find(buttons.attachmentItem).attr('class'), 'is-selected', 'The inner item has the selected class');
  exists(buttons.attachmentSelectionOverlay, 'The selected overlay exists');

  exists(buttons.attachmentsUnselect, 'The unselect button exists');
  exists(buttons.attachmentsNew, 'The new record button exists');
  exists(buttons.attachmentsMaterials, 'The materials toggle exists');
  exists(buttons.attachmentsServices, 'The services toggle exists');

  click(buttons.attachmentsUnselect);

  andThen(function() {
    equal(attachment.get('isSelected'), false, 'The model is flagged as unselected');
    notContains(find(buttons.attachmentItem).attr('class'), 'is-selected', 'The inner item does not have the selected class');
  });
});


test('Creating a new record with one attachment', function() {
  expect(4);
  var attachment1 = fixtures.createAttachment(1, true),
      attachment2 = fixtures.createAttachment(2, true);

  click(find(buttons.attachment).eq(0));
  click(buttons.attachmentsNew);

  andThen(function() {
    var model = lookups.currentModel();

    equal(lookups.path(), 'purchase.new', 'Transitions to the new route');
    equal(model.get('attachments.content.length'), 1, 'The model has one attachment');
    equal(!isEmpty(attachment1.get('purchase')), true, 'The first attachment is related to the purchase');
    equal(isEmpty(attachment2.get('purchase')), true, 'The second attachment is not related to the purchase');
  });
});


test('Creating a new record with two attachments', function() {
  expect(4);
  var attachment1 = fixtures.createAttachment(1, true),
      attachment2 = fixtures.createAttachment(2, true);

  click(find(buttons.attachment).eq(0));
  click(find(buttons.attachment).eq(1));
  click(buttons.attachmentsNew);

  andThen(function() {
    var model = lookups.currentModel();

    equal(lookups.path(), 'purchase.new', 'Transitions to the new route');
    equal(model.get('attachments.content.length'), 2, 'The model has two attachments');
    equal(!isEmpty(attachment1.get('purchase')), true, 'The first attachment is related to the purchase');
    equal(!isEmpty(attachment2.get('purchase')), true, 'The second attachment is related to the purchase');
  });
});


test('You can not create a record with a dirty attachment', function() {
  expect(1);
  var attachment = fixtures.createAttachment(1, true);

  Ember.run(function() {
    attachment.send('becomeDirty');
  });

  click(find(buttons.attachment).eq(0));
  click(buttons.attachmentsNew);

  andThen(function() {
    equal(lookups.path(), 'attachments', 'Transitions to the new route');
  });
});


test('Simulated drop', function() {
  expect(7);
  var store = lookups.store(),
      attachment = fixtures.createAttachment(1, true),
      controller = lookups.controller('attachments');

  myMocks.addMock(App.getUrl('/attachments?'), function(data) {
    return { attachments: [{ id: 55 }] };
  });

  var view = App.AttachmentsView.extend({ controller: controller }).create();

  var mockFile = { lastModifiedDate: '1/1/2014', name: 'file.txt' },
      payload = { dataTransfer: { files: [ mockFile ] },
                  preventDefault: function() {},
                  stopPropagation: function() {} };

  Ember.run(function() {
    view.drop(payload, $());
  });

  // Not all async operations are happening, so refresh the route to tidy everything up
  visit('/attachments');

  andThen(function() {
    var newAttachment = store.all('attachment').get('content.lastObject');

    equal(myMocks.ajaxParams.type, 'POST', 'A POST message is sent');
    equal(myMocks.ajaxParams.url, App.getUrl('/attachments?'), 'The correct url is called');
    equal(find(buttons.attachment).length, 2, 'There are two items in the DOM');

    equal(attachment.get('isDirty'), false, 'The first attachment is not dirty');
    equal(attachment.id, 1, 'The first attachment still has the correct ID');

    equal(newAttachment.get('isDirty'), false, 'The new attachment is not dirty');
    equal(newAttachment.id, 55, 'The new attachment has the correct ID');
  });
});


// Attachment delete / upload rollback
// Test selection count
