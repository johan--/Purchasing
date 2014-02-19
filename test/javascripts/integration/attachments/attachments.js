
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
  expect(3);
  var attachment1 = fixtures.createAttachment(1, true),
      attachment2 = fixtures.createAttachment(2, true);

  click(find(buttons.attachment).eq(0));
  click(buttons.attachmentsNew);

  andThen(function() {
    var model = lookups.currentModel();

    equal(model.get('attachments.content.length'), 1, 'The model has one attachment');
    equal(!isEmpty(attachment1.get('purchase')), true, 'The first attachment is related to the purchase');
    equal(isEmpty(attachment2.get('purchase')), true, 'The second attachment is not related to the purchase');
  });
});


test('Creating a new record with two attachments', function() {
  expect(3);
  var attachment1 = fixtures.createAttachment(1, true),
      attachment2 = fixtures.createAttachment(2, true);

  click(find(buttons.attachment).eq(0));
  click(find(buttons.attachment).eq(1));
  click(buttons.attachmentsNew);

  andThen(function() {
    var model = lookups.currentModel();

    equal(model.get('attachments.content.length'), 2, 'The model has two attachments');
    equal(!isEmpty(attachment1.get('purchase')), true, 'The first attachment is related to the purchase');
    equal(!isEmpty(attachment2.get('purchase')), true, 'The second attachment is related to the purchase');
  });
});


// Simulate drop
