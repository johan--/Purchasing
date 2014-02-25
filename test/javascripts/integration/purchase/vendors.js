
module('Integration - Controllers - Purchase Vendors', {
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


test('Is bound to model.vendors.@each', function() {
  expect(17);
  var vendors = lookups.currentModel().get('vendors'),
      store = lookups.store(),
      tokens = find(buttons.purchaseVendorTokens),
      newVendor1 = null,
      newVendor2 = null;

  equal(vendors.get('length'), 0, 'There are no vendors');
  equal(tokens.length, 0, 'With no vendors there are no tokens');

  Ember.run(function() {
    newVendor1 = store.createRecord('vendor', {name: 'test1', id: 5});
    vendors.pushObject(newVendor1);
  });

  tokens = find(buttons.purchaseVendorTokens);

  equal(vendors.get('firstObject.name'), 'test1', 'The model has the correct name');
  equal(vendors.get('firstObject.id'), 5, 'The model has the correct id');
  equal(vendors.get('length'), 1, 'There is one vendor');
  equal(tokens.length, 1, 'With one vendor there is one token');
  contains(tokens.eq(0).text(), 'test1', 'The token has the vendor name');

  Ember.run(function() {
    newVendor2 = store.createRecord('vendor', {name: 'test2', id: 6});
    vendors.pushObject(newVendor2);
  });

  tokens = find(buttons.purchaseVendorTokens);

  equal(vendors.get('lastObject.name'), 'test2', 'The model has the correct name');
  equal(vendors.get('lastObject.id'), 6, 'The model has the correct id');
  equal(vendors.get('length'), 2, 'There are two vendors');
  equal(tokens.length, 2, 'With two vendors there are two tokens');
  contains(tokens.eq(1).text(), 'test2', 'The token has the vendor name');

  Ember.run(function() {
    vendors.removeObject(newVendor1);
  });

  tokens = find(buttons.purchaseVendorTokens);

  equal(vendors.get('firstObject.name'), 'test2', 'The model has the correct name');
  equal(vendors.get('firstObject.id'), 6, 'The model has the correct id');
  equal(vendors.get('length'), 1, 'There is one vendor');
  equal(tokens.length, 1, 'With one vendor there is one token');
  contains(tokens.eq(0).text(), 'test2', 'The token has the vendor name');
});


test('Removing a token removes it from model with one vendor', function() {
  expect(3);
  var model = lookups.currentModel(),
      vendors = model.get('vendors'),
      store = lookups.store(),
      tokens = find(buttons.purchaseVendorTokens),
      newVendor1 = null;

  Ember.run(function() {
    newVendor1 = store.createRecord('vendor', { name: 'test1', id: 5 });
    vendors.pushObject(newVendor1);

    $('#vendor_tokens').tokenInput('remove', {  name: 'test1' });
  });

  andThen(function() {
    var tokens = find(buttons.purchaseVendorTokens);

    equal(model.get('isDirty'), true, 'The parent model is dirty');
    equal(vendors.get('length'), 0, 'There are no vendors');
    equal(tokens.length, 0, 'With no vendors there are no tokens');
  });
});


test('Removing a token removes it from model with two vendors', function() {
  expect(6);
  var model = lookups.currentModel(),
      vendors = model.get('vendors'),
      store = lookups.store(),
      tokens = find(buttons.purchaseVendorTokens),
      newVendor1 = null,
      newVendor2 = null;

  Ember.run(function() {
    newVendor1 = store.createRecord('vendor', {name: 'test1', id: 5});
    newVendor2 = store.createRecord('vendor', {name: 'test2', id: 6});
    vendors.pushObject(newVendor1);
    vendors.pushObject(newVendor2);

    $('#vendor_tokens').tokenInput('remove', { name: 'test2' });
  });

  andThen(function() {
    var tokens = find(buttons.purchaseVendorTokens);

    equal(model.get('isDirty'), true, 'The parent model is dirty');
    equal(vendors.get('firstObject.name'), 'test1', 'The model has the correct name');
    equal(vendors.get('firstObject.id'), 5, 'The model has the correct id');
    equal(vendors.get('length'), 1, 'There is one vendor');
    equal(tokens.length, 1, 'With one vendor there is one tokens');
    contains(tokens.eq(0).text(), 'test1', 'The token has the vendor name');
  });
});


test('Adding a token adds it to model with no existing tokens', function() {
  expect(6);
  var model = lookups.currentModel(),
      vendors = model.get('vendors'),
      store = lookups.store(),
      tokens = find(buttons.purchaseVendorTokens);

  Ember.run(function() {
    $('#vendor_tokens').tokenInput('add', { name: 'test3', id: 2 });
  });

  andThen(function() {
    var tokens = find(buttons.purchaseVendorTokens);

    equal(model.get('isDirty'), true, 'The parent model is dirty');
    equal(vendors.get('length'), 1, 'There is one vendor');
    equal(vendors.get('firstObject.name'), 'test3', 'The model has the correct name');
    equal(vendors.get('firstObject.id'), 2, 'The model has the correct id');
    equal(tokens.length, 1, 'With one vendor there is one tokens');
    contains(tokens.eq(0).text(), 'test3', 'The token has the vendor name');
  });
});


test('Adding a token adds it to model with one existing tokens', function() {
  expect(8);
  var model = lookups.currentModel(),
      vendors = model.get('vendors'),
      store = lookups.store(),
      tokens = find(buttons.purchaseVendorTokens),
      newVendor1 = null;

  Ember.run(function() {
    newVendor1 = store.createRecord('vendor', {name: 'test1', id: 5});
    vendors.pushObject(newVendor1);

    $('#vendor_tokens').tokenInput('add', { name: 'test3', id: 2 });
  });


  andThen(function() {
    var tokens = find(buttons.purchaseVendorTokens);

    equal(model.get('isDirty'), true, 'The parent model is dirty');
    equal(vendors.get('firstObject.name'), 'test1', 'The model has the correct name');
    equal(vendors.get('firstObject.id'), 5, 'The model has the correct id');
    equal(vendors.get('lastObject.name'), 'test3', 'The model has the correct name');
    equal(vendors.get('lastObject.id'), 2, 'The model has the correct id');
    equal(vendors.get('length'), 2, 'There iare two vendors');
    equal(tokens.length, 2, 'With two vendors there are two tokens');
    contains(tokens.eq(1).text(), 'test3', 'The token has the vendor name');
  });
});
