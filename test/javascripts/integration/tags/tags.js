
module('Integration - Tags - Tags', {
  setup: function() {
    myMocks.clearMocks();

    // Build fixtures
    fixtures.reset();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/');
  },

  teardown: function() {
    visit('/'); // Force cleanup
  }
});


test('Open modal', function() {
  expect(2);

  isHidden(buttons.tagsModal, true, 'Initially the modal is hidden');

  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags);

  andThen(function() {

    isVisible(buttons.tagsModal, true, 'Then the modal is visible');

  });
});


test('Clicking an item sets it into edit mode and focuses the input', function() {
  expect(2);

  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags).then(function() {

    return click(find(buttons.tagsListItem)[0]);

  }).then(function() {

    var store = lookups.store(),
        tag = store.all('tag').get('lastObject'); // Because sort is descending

    equal(tag.get('isEditing'), true, 'The tag is being editing');
    isFocused(buttons.tagsEditInput, 'The input is focussed');

  });
});


test('Clicking cancel exits edit mode and rolls back', function() {
  expect(4);
  var store = lookups.store(),
      oldName = null;

  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags).then(function() {

    oldName = store.all('tag').get('lastObject.name');

    click(find(buttons.tagsListItem)[0]);
    fillIn(find(buttons.tagsEditInput)[0], 'Test test test');

    return click(find(buttons.tagsEditCancel)[0]);

  }).then(function() {

    var tag = store.all('tag').get('lastObject'); // Because sort is descending

    equal(tag.get('isEditing'), false, 'The tag is not being edited');
    equal(tag.get('isDirty'), false, 'The tag is rolled back');
    equal(find(buttons.tagsEditInput).length, 0, 'There are no inputs');
    equal(tag.get('name'), oldName, 'The tags name is not updated');

  });
});


test('Clicking save saves the record', function() {
  expect(4);
  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags).then(function() {

    click(find(buttons.tagsListItem)[0]);
    fillIn(find(buttons.tagsEditInput)[0], 'Test test test');

    return click(find(buttons.tagsEditSave)[0]);

  }).then(function() {

    var store = lookups.store(),
        tag = store.all('tag').get('lastObject'); // Because sort is descending

    equal(tag.get('isEditing'), false, 'The tag is not being edited');
    equal(tag.get('isDirty'), false, 'The tag is rolled back');
    equal(find(buttons.tagsEditInput).length, 0, 'There are no inputs');
    equal(tag.get('name'), 'Test test test', 'The tags name is updated');

  });
});


test('Clicking an item then another clears edit and rolls back on the first', function() {
  expect(3);
  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags).then(function() {

    return click(find(buttons.tagsListItem)[0]);

  }).then(function() {

    return click(find(buttons.tagsListItem)[0]); // It's the first unedited item

  }).then(function() {

    var store = lookups.store(),
        tags = store.all('tag').get('content'), // Because sort is descending
        numTags = tags.length - 1;

    equal(tags[numTags].get('isDirty'), false, 'The first tag is not dirty');
    equal(tags[numTags].get('isEditing'), false, 'The first tag is not being edited');

    equal(tags[numTags-1].get('isEditing'), true, 'The second tag is being edited');

  });
});


test('Clicking create starts a new record', function() {
  expect(3);
  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags).then(function() {

    return click(buttons.tagsListCreate);

  }).then(function() {

    var store = lookups.store(),
        tag = store.all('tag').get('lastObject');

    equal(tag.get('isEditing'), true, 'The new tag is being edited');
    equal(tag.get('isDirty'), true, 'The new tag is dirty');
    equal(tag.get('isNew'), true, 'The new tag is new');

  });
});


// I can't determine why this test is breaking the app
// The click event when fired via jquery raises exceptions indicating that something is trying
// to set an attribute on the deleted new record.  This works just fine with a normal click

/*
test('Clicking create then cancel deletes the original', function() {
  expect(3);
  var store = lookups.store(),
      newRecord = null;

  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags).then(function() {

    return click(buttons.tagsListCreate);

  }).then(function() {

    newRecord = store.all('tag').get('lastObject');

    return click(find(buttons.tagsListItem)[0]);

  }).then(function() {

    var curRecord = store.all('tag').get('lastObject');

    equal(newRecord.get('isDeleted'), true, 'The new record is deleted');
    equal(newRecord.get('isEditing'), false, 'The new record is not being edited');
    equal(curRecord.get('isEditing'), true, 'The next record is being edited');

  });
});
*/


test('Create and close buttons disappear when editing', function() {
  expect(2);

  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags);

  andThen(function() {

    click(find(buttons.tagsListItem)[0]);

    isHidden(buttons.tagsListCreate, 'The create button is hidden');
    isHidden(buttons.tagsListClose, 'The create button is hidden');

  });
});


test('Clicking the delete button deletes the record', function() {
  expect(3);

  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags);

  andThen(function() {

    var store = lookups.store(),
        record = store.all('tag').get('lastObject'),
        numberItems = find(buttons.tagsListItem).length;

    click(find(buttons.tagsListDelete)[0]);

    equal(record.get('isDeleted'), true, 'The record is deleted');
    equal(record.get('isEditing'), false, 'The record is not editing');
    equal(find(buttons.tagsListItem).length, numberItems - 1, 'The DOM is removed from the list');

  });
});


test('Closing the modal rolls back any records and clears isEditing', function() {
  expect(3);
  var store = lookups.store(),
      record = null,
      oldName = null;

  click(buttons.navBarOptions);
  click(buttons.navBarOptionsTags).then(function() {

    record = store.all('tag').get('lastObject');
    oldName = record.get('name');

    click(find(buttons.tagsListItem)[0]);
    fillIn(find(buttons.tagsEditInput)[0], 'Test test test');

    return click(buttons.modalBackground);

  }).then(function() {

    equal(record.get('isEditing'), false, 'The record is not editing');
    equal(record.get('isDirty'), false, 'The record is not dirty');
    equal(record.get('name'), oldName, 'The records name is rolled back');

  });
});


// Closing the modal deletes a new record
