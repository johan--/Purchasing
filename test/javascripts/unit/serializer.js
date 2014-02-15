
// Receivings also uses it
module('Unit - Serializer', {
  setup: function() {
    // Build fixtures
    fixtures.injectFixtures();
    fixtures.updateAllFixtures(App.Purchase, { buyer: { id: 245, name: 'a buyer' },
                                       requester: { id: 123, name: 'a test person' },
                                       recipient: { id: 125, name: 'a test person 2' },
                                     });

    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {

  }
});


test('Purchase serialized', function(){
  expect(36);
  var store = lookups.store(),
      model = lookups.currentModel(),
      line1 = fixtures.createLine(),
      line2 = fixtures.createLine(),
      line3 = fixtures.createLine(),
      receiving = fixtures.createReceiving(line1),
      note1 = fixtures.createNote(),
      note2 = fixtures.createNote(),
      vendor1 = null,
      vendor2 = null,
      tag1 = null,
      tag2 = null,
      account = null;

  Ember.run(function(){
    tag1 = store.createRecord('tag', META_FIXTURE_BASE.tags[0]);
    tag2 = store.createRecord('tag', META_FIXTURE_BASE.tags[1]);
    vendor1 = store.createRecord('vendor', App.Vendor.FIXTURES_BASE[0]);
    vendor2 = store.createRecord('vendor', App.Vendor.FIXTURES_BASE[1]);
    account = store.createRecord('account', { id: 1, number: '123456-123456-12345' });

    model.get('tags').pushObject(tag1);
    model.get('tags').pushObject(tag2);
    model.get('vendors').pushObject(vendor1);
    model.get('vendors').pushObject(vendor2);
    model.set('account', account);

    line1.set('isDestroy', true);
    note1.set('isDestroy', true);
    tag1.set('isDestroy', true);
  });

  andThen(function() {
    var response = model.serialize();

    equal(response.account_id, '1', 'Account ID is set');

    equal(response.buyer, '245', 'Buyer ID is set');
    equal(response.requester, '123', 'Requester ID is set');
    equal(response.recipient, '125', 'Recipient ID is set');

    ok(!isEmpty(response.date_requested), 'Date Requested is not empty');

    ok(!isEmpty(response.line_items_attributes), 'Line items are sent');
    equal(response.line_items_attributes[1].id, line1.id, 'Line 1 is sent');
    equal(response.line_items_attributes[1].description, line1.get('description'), 'Line 1 description is sent');
    equal(response.line_items_attributes[1]['_destroy'], 'true', 'Line 1 is deleted');
    equal(response.line_items_attributes[2].id, line2.id, 'Line 2 is sent');
    equal(response.line_items_attributes[2].description, line2.get('description'), 'Line 2 description is sent');
    equal(response.line_items_attributes[2]['_destroy'], 'false', 'Line 2 is not deleted');
    equal(response.line_items_attributes[3].id, line3.id, 'Line 3 is sent');
    equal(response.line_items_attributes[3].description, line3.get('description'), 'Line 3 description is sent');
    equal(response.line_items_attributes[3]['_destroy'], 'false', 'Line 3 is not deleted');

    ok(isEmpty(response.receivngs_attributes), 'No receivings are sent');
    ok(isEmpty(response.receivng_lines_attributes), 'No receiving lines are sent');

    ok(!isEmpty(response.notes_attributes), 'Notes are sent');
    equal(response.notes_attributes[1].id, note1.id, 'Note 1 is sent');
    equal(response.notes_attributes[1].description, note1.get('description'), 'Note 1 description is sent');
    equal(response.notes_attributes[1]['_destroy'], 'true', 'Note 1 is deleted');
    equal(response.notes_attributes[2].id, note2.id, 'Note 2 is sent');
    equal(response.notes_attributes[2].description, note2.get('description'), 'Note 2 description is sent');
    equal(response.notes_attributes[2]['_destroy'], 'false', 'Note 2 is not deleted');

    ok(isEmpty(response.tags_attributes), 'Tags are not sent');
    ok(!isEmpty(response.purchase_to_tags_attributes), 'Tags join table is sent');
    equal(response.purchase_to_tags_attributes[0].tag_id, tag1.id, 'Tag 1 is sent with correct tag_id');
    equal(response.purchase_to_tags_attributes[0].purchase_id, model.id, 'Tag 1 is sent with correct purchase_id');
    equal(response.purchase_to_tags_attributes[0].name, tag1.get('name'), 'Tag 1 name is sent');
    equal(response.purchase_to_tags_attributes[0]['_destroy'], 'true', 'Tag 1 is deleted');
    equal(response.purchase_to_tags_attributes[1].tag_id, tag2.id, 'Tag 2 is sent with correct tag_id');
    equal(response.purchase_to_tags_attributes[1].purchase_id, model.id, 'Tag 2 is sent with correct purchase_id');
    equal(response.purchase_to_tags_attributes[1].name, tag2.get('name'), 'Tag 2 name is sent');
    equal(response.purchase_to_tags_attributes[1]['_destroy'], 'false', 'Tag 2 is not deleted');

    equal(response.tax_rate, '0.1', 'Tax rate is set');

    equal(response.vendors, '[{"name":"A vendor","id":"1"},{"name":"Another vendor","id":"2"}]', 'Vendors are serialized into a string');
  });
});


test('Receiving serialized', function(){
  expect(10);
  var store = lookups.store(),
      model = lookups.currentModel(),
      line1 = fixtures.createLine(),
      line2 = fixtures.createLine(),
      line3 = fixtures.createLine(),
      receiving = fixtures.createReceiving(line1),
      receiving_line1 = receiving.get('receivingLines.firstObject'),
      receiving_line2 = null;

  Ember.run(function() {
    receiving_line2 = store.createRecord('receivingLine', { purchase: model.id, quantity: line2.quantity });
    receiving.get('receivingLines').pushObject(receiving_line2);
    receiving_line2.set('lineItem', line2);
    receiving.set('package_num', 'U123');
    receiving.set('package_date', '1/2/2014');
  });

  andThen(function() {
    var response = receiving.serialize();

    equal(response.purchase_id, '1', 'Receiving document is sent with purchase ID');
    equal(response.package_num, 'U123', 'Package # is sent');
    equal(response.package_date, '1/2/2014', 'Package date is sent');

    ok(!isEmpty(response.receiving_lines_attributes), 'Receiving Lines are sent');
    equal(response.receiving_lines_attributes[0].id, receiving_line1.id, 'Line 1 is sent');
    equal(response.receiving_lines_attributes[0].line_item_id, line1.id, 'Line 1 line_id is sent');
    equal(response.receiving_lines_attributes[0].quantity, receiving_line1.get('quantity'), 'Line 1 quantity is sent');

    equal(response.receiving_lines_attributes[1].id, receiving_line2.id, 'Line 2 is sent');
    equal(response.receiving_lines_attributes[1].line_item_id, line2.id, 'Line 2 line_id is sent');
    equal(response.receiving_lines_attributes[1].quantity, receiving_line2.get('quantity'), 'Line 2 quantity is sent');
  });
});
