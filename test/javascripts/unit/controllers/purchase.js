
module('Unit - Controllers - Purchase', {
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


test('It validates the presence of a vendor', function() {
  expect(4);
  var model = lookups.currentModel();

  Ember.run(function() {
    fixtures.updateOneFixture('purchase', 1, { requester: { id: 5, name: 'A test person' },
                                               dateRequested: '1/1/2014' });
    model.send('becomeDirty');
  });

  click(buttons.purchaseSave);

  andThen(function() {
    var date_field = find(buttons.dateRequestedField),
        requester_field = find('.requester_name'),
        vendor_field = find('.vendor_token_input').parent(),
        message = lookups.controller('application').get('notifications')[0].message;

    contains(vendor_field.attr('class'), 'has-error', 'The vendor field is flagged as error');
    notContains(requester_field.attr('class'), 'has-error', 'The requester field is flagged not in error');
    notContains(date_field.attr('class'), 'has-error', 'The dateRequested field is flagged not in error');
    contains(message, 'There is a missing field: Vendors.', 'A correct message is displayed');
  });
});


test('It validates the presence of a requester', function() {
  expect(4);
  var model = lookups.currentModel();

  Ember.run(function() {
    fixtures.updateOneFixture('purchase', 1, { dateRequested: '1/1/2014' });
    var vendor = fixtures.createVendor();

    model.send('becomeDirty');
  });

  click(buttons.purchaseSave);

  andThen(function() {
    var date_field = find(buttons.dateRequestedField),
        requester_field = find('.requester_name'),
        vendor_field = find('.vendor_token_input').parent(),
        message = lookups.controller('application').get('notifications')[0].message;

    notContains(vendor_field.attr('class'), 'has-error', 'The vendor field is flagged not in error');
    contains(requester_field.attr('class'), 'has-error', 'The requester field is flagged as error');
    notContains(date_field.attr('class'), 'has-error', 'The dateRequested field is flagged not in error');
    contains(message, 'There is a missing field: Requester.', 'A correct message is displayed');
  });
});


test('It validates the presence of dateRequested', function() {
  expect(4);
  var model = lookups.currentModel();

  Ember.run(function() {
    fixtures.updateOneFixture('purchase', 1, { dateRequested: null,
                                               requester: { id: 5, name: 'A test person' } });
    var vendor = fixtures.createVendor();

    model.send('becomeDirty');
  });

  click(buttons.purchaseSave);

  andThen(function() {
    var date_field = find(buttons.dateRequestedField),
        requester_field = find('.requester_name'),
        vendor_field = find('.vendor_token_input').parent(),
        message = lookups.controller('application').get('notifications')[0].message;

    notContains(vendor_field.attr('class'), 'has-error', 'The vendor field is flagged not in error');
    notContains(requester_field.attr('class'), 'has-error', 'The requester field is flagged as error');
    contains(date_field.attr('class'), 'has-error', 'The dateRequested field is flagged not in error');
    contains(message, 'There is a missing field: Date Requested.', 'A correct message is displayed');
  });
});


test('All 3 required fields work', function() {
  expect(4);
  var model = lookups.currentModel(),
      controller = lookups.controller('purchase.edit');

  Ember.run(function() {
    fixtures.updateOneFixture('purchase', 1, { dateRequested: '1/1/2014',
                                               requester: { id: 5, name: 'A test person' } });
    var vendor = fixtures.createVendor();

    model.send('becomeDirty');
  });

  var result = controller.validateRecord();

  andThen(function() {

    var date_field = find(buttons.dateRequestedField),
        requester_field = find('.requester_name'),
        vendor_field = find('.vendor_token_input').parent();

    notContains(vendor_field.attr('class'), 'has-error', 'The vendor field is flagged not in error');
    notContains(date_field.attr('class'), 'has-error', 'The dateRequested field is flagged not in error');
    notContains(requester_field.attr('class'), 'has-error', 'The requester field is flagged not in error');

    equal(result, true, 'There are no errors');

  });
});
