
module('Integration - Vendors - Vendors', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/vendors');
  },

  teardown: function() {
  }
});


test('Clicking a vendor opens show', function() {
  expect(9);
  click(find(buttons.vendorRecord)[0]);

  andThen(function() {

    var model = lookups.currentModel().get('firstObject');

    isVisible(buttons.vendorModalShow, 'The vendor show modal is visible');
    isHidden(buttons.vendorModalEdit, 'The vendor edit modal is not visible');

    isHidden(buttons.vendorCancel, 'The vendor cancel button is hidden');
    isVisible(buttons.vendorDelete, 'The vendor delete button is visible');
    isVisible(buttons.vendorEdit, 'The vendor edit button is visible');
    isHidden(buttons.vendorSave, 'The vendor save button is hidden');
    isHidden(buttons.vendorCreate, 'The vendor create button is hidden');

    contains(find('h3').text(), model.get('id'), 'The ID is displayed');
    contains(find('h3').text(), model.get('name'), 'The name is displayed');

  });
});


test('Vendor edit', function() {
  expect(9);
  click(find(buttons.vendorRecord)[0]);
  click(buttons.vendorEdit);

  andThen(function() {

    var model = lookups.currentModel().get('firstObject');

    isVisible(buttons.vendorModalEdit, 'The vendor edit modal is visible');
    isHidden(buttons.vendorModalShow, 'The vendor show modal is not visible');

    isVisible(buttons.vendorCancel, 'The vendor cancel button is visible');
    isVisible(buttons.vendorDelete, 'The vendor delete button is visible');
    isHidden(buttons.vendorEdit, 'The vendor edit button is hidden');
    isHidden(buttons.vendorSave, 'The vendor save button is hidden');
    isHidden(buttons.vendorCreate, 'The vendor create button is hidden');

    contains(find('h2').text(), model.get('id'), 'The ID is displayed');
    contains(find('h2').text(), 'Edit Vendor', 'The edit title is displayed');

  });
});


test('New vendor button opens new', function() {
  expect(9);
  click(buttons.vendorNew);

  andThen(function() {

    var model = lookups.store().all('vendor').get('lastObject');

    isHidden(buttons.vendorModalShow, 'The vendor show modal is not visible');
    isVisible(buttons.vendorModalEdit, 'The vendor edit modal is visible');

    equal(model.get('isNew'), true, 'A new record is created');
    contains(find('h2').text(), 'New Vendor', 'The new vendor title exists');

    isVisible(buttons.vendorCancel, 'The vendor cancel button is visible');
    isHidden(buttons.vendorDelete, 'The vendor delete button is hidden');
    isHidden(buttons.vendorEdit, 'The vendor edit button is hidden');
    isHidden(buttons.vendorSave, 'The vendor save button is hidden');
    isVisible(buttons.vendorCreate, 'The vendor create button is visible');

  });
});


test('Save button appears on edit when dirty', function() {
  expect(1);
  var model = lookups.store().all('vendor').get('firstObject');

  click(find(buttons.vendorRecord)[0]);
  click(buttons.vendorEdit);

  Ember.run(function() {
    model.send('becomeDirty');
  });

  andThen(function() {

    isVisible(buttons.vendorSave, 'The vendor save button is visible');

  });
});


test('Save button does not appear on show when dirty', function() {
  expect(1);
  var model = lookups.store().all('vendor').get('firstObject');

  click(find(buttons.vendorRecord)[0]);

  Ember.run(function() {
    model.send('becomeDirty');
  });

  andThen(function() {

    isHidden(buttons.vendorSave, 'The vendor save button is hidden');

  });
});


test('Vendor save works', function() {
  expect(4);
  var model = lookups.store().all('vendor').get('firstObject');

  click(find(buttons.vendorRecord)[0]);
  click(buttons.vendorEdit);

  Ember.run(function() {
    model.set('name', 'A new name');
  });

  click(buttons.vendorSave);

  andThen(function() {

    isHidden(buttons.vendorModalEdit, 'The edit modal is hidden');
    isVisible(buttons.vendorModalShow, 'The show modal is visible');

    equal(model.get('isDirty'), false, 'The model is saved');
    equal(model.get('name'), 'A new name', 'The model name is updated');

  });
});


test('Vendor delete works', function() {
  expect(3);
  var model = lookups.store().all('vendor').get('firstObject');

  click(find(buttons.vendorRecord)[0]);
  click(buttons.vendorEdit);
  click(buttons.vendorDelete);

  andThen(function() {

    isHidden(buttons.vendorModalEdit, 'The edit modal is hidden');
    isHidden(buttons.vendorModalShow, 'The show modal is hidden');

    equal(model.get('isDeleted'), true, 'The model is deleted');

  });
});


test('Delete button is disabled on show if there are purchases', function() {
  expect(1);
  var model = lookups.store().all('vendor').get('firstObject');

  click(find(buttons.vendorRecord)[0]);

  Ember.run(function() {
    model.set('num_purchases', 1);
  });

  andThen(function() {

    var el = find(buttons.vendorDelete);
    equal(el.attr('disabled'), 'disabled', 'The delete button is disabled');

  });
});


test('Delete button is disabled on edit if there are purchases', function() {
  expect(1);
  var model = lookups.store().all('vendor').get('firstObject');

  click(find(buttons.vendorRecord)[0]);
  click(buttons.vendorEdit);

  Ember.run(function() {
    model.set('num_purchases', 1);
  });

  andThen(function() {

    var el = find(buttons.vendorDelete);
    equal(el.attr('disabled'), 'disabled', 'The delete button is disabled');

  });
});


test('Name field validation', function() {
  expect(2);

  click(buttons.vendorNew);
  contains(find(buttons.vendorName).parent().attr('class'), 'has-error', 'A blank name field has the error class');
  fillIn(find(buttons.vendorName), 'A new vendor');

  andThen(function() {

    notContains(find(buttons.vendorName).attr('class'), 'has-error', 'A filled in name field does not have the error class');

  });
});


test('Vendor create', function() {
  expect(3);

  click(buttons.vendorNew);
  fillIn(buttons.vendorName, 'A new vendor');
  click(buttons.vendorCreate);

  andThen(function() {

    var model = lookups.store().all('vendor').get('lastObject');
    equal(model.get('name'), 'A new vendor', 'The name field is saved');
    equal(model.get('isDirty'), false, 'The record is not dirty');
    equal(model.get('isNew'), false, 'The record is not new');

  });
});


test('Vendor create then rollback', function() {
  expect(2);

  click(buttons.vendorNew);
  fillIn(buttons.vendorName, 'A new vendor');

  andThen(function() {

    var model = lookups.store().all('vendor').get('lastObject');

    click(buttons.vendorCancel);
    equal(model.get('isDeleted'), true, 'The new record is deleted');

    contains(myMocks.alertMessage, 'Warning, there are unsaved changes', 'The warning message appears');

  });
});


test('Vendor edit then rollback', function() {
  expect(3);

  click(find(buttons.vendorRecord)[0]);
  click(buttons.vendorEdit);
  fillIn(buttons.vendorName, 'A new vendor');

  andThen(function() {

    var model = lookups.store().all('vendor').get('firstObject');
    click(buttons.vendorCancel);

    equal(model.get('isDirty'), false, 'The record is rolled back');
    notEqual(model.get('name'), 'A new vendor', 'The name is rolled back');

    contains(myMocks.alertMessage, 'Warning, there are unsaved changes', 'The warning message appears');

  });
});


test('Websites and emails are hrefs on show', function() {
  expect(3);
  click(find(buttons.vendorRecord)[0]);

  andThen(function() {

    var website = find(buttons.vendorWebsite),
        email = find(buttons.vendorEmail);

    equal(website.children('a').attr('href'), 'http://www.someplace.com', 'The website link is correct');
    equal(website.children('a').attr('target'), '_blank', 'The website link will open in a new window');
    equal(email.children('a').attr('href'), 'mailto://person@someplace.com', 'The email link is correct');

  });
});


test('Scenario: New, Create, then Delete', function() {
  expect(3);
  var model = null;

  click(buttons.vendorNew);
  fillIn(buttons.vendorName, 'A test vendor');
  click(buttons.vendorCreate);

  andThen(function() {

    model = lookups.store().all('vendor').get('lastObject');

    return click(buttons.vendorDelete);

  }).then(function() {

    equal(model.get('isDeleted'), true, 'The model is deleted');
    isHidden(buttons.vendorModalShow, 'The show modal is hidden');
    isHidden(buttons.vendorModalEdit, 'The edit modal is hidden');

  });
});
