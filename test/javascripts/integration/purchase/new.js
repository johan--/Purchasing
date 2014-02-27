
module('Integration - Purchase - New', {
  setup: function() {

    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/new');
  },

  teardown: function() {
  }

});

test('Elements that should not be visible as new', function() {
  expect(8);

  isHidden(buttons.purchaseGoBack, 'The go back button is hidden');
  isHidden(buttons.receivingBox, 'The receiving box is hidden');
  isHidden(buttons.purchaseEditAttachments, 'The attachments button is hidden');
  isHidden(buttons.purchaseEditSavePDF, 'The save PDF button is hidden');
  isHidden(buttons.purchaseEditEmail, 'The email button is hidden');
  isHidden(buttons.purchaseEditPrint, 'The print button is hidden');
  isHidden(buttons.purchaseEditDelete, 'The delete button is hidden');
  isHidden(buttons.purchaseEditCancel, 'The cancel requisition button is hidden');

});


test('New attachments are show', function() {
  expect(3);
  var model = lookups.currentModel(),
      attachment1 = fixtures.createAttachment(),
      attachment2 = fixtures.createAttachment();

  equal(find(buttons.purchaseNewReqAttachment).length, 2, 'There should be 2 attachments visible');
  equal(find(buttons.purchaseNewReqAttachmentDelete).length, 2, 'There should be 2 delete buttons');
  equal(model.get('attachments.length'), 2, 'The model has 2 attachments');

});


test('Delete attachment', function() {
  expect(2);
  var model = lookups.currentModel(),
      attachment1 = fixtures.createAttachment(),
      attachment2 = fixtures.createAttachment();

  click(find(buttons.purchaseNewReqAttachmentDelete).eq(0));

  andThen(function() {

    equal(model.get('attachments.length'), 1, 'The model has 1 attachment');
    equal(find(buttons.purchaseNewReqAttachment).length, 1, 'There should be 1 attachment visible');

  });
});
