
module('Integration - Purchase - Notes', {
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


test('The new note button appears on show', function(){
  expect(1);
  visit('/purchases/1/show');

  isVisible(buttons.noteAdd, 'The note add buttons is visible on show');
});


test('The new note button appears on edit', function(){
  expect(1);

  isVisible(buttons.noteAdd, 'The note add buttons is visible on show');
});


test('Add note button opens modal', function() {
  expect(1);

  click(buttons.noteAdd);

  andThen(function() {
    isVisible(buttons.noteModal, 'The note modal is visible');
  });
});


test('Note validation text', function() {
  expect(2);

  click(buttons.noteAdd);
  contains(find(buttons.noteNewText).attr('class'), 'has-error', 'With no text the input is styled');

  fillIn(buttons.noteNewTextInput, 'Test Note');

  andThen(function(){
    notContains(find(buttons.noteNewText).attr('class'), 'has-error', 'With text the input is styled');
  });
});


test('When closing modal without saving note is removed from parent view', function() {
  expect(2);

  click(buttons.noteAdd);
  equal(find(buttons.note).length, 1, 'Clicking new adds a note to the view');

  click(buttons.modalBackground);

  andThen(function() {
    equal(find(buttons.note).length, 0, 'Closing the new modal without saving removes that note from the view');
  });
});


test('When closing modal without saving note is rolled back', function() {
  expect(3);
  var note = fixtures.createNote(1, 'A note');

  click(find(buttons.note).eq(0));
  fillIn(buttons.noteNewTextInput, 'An updated note').then(function() {

    equal(note.get('text'), 'An updated note', 'The note is initially changed');
    return click(buttons.modalBackground);

  }).then(function() {
    equal(note.get('text'), 'A note', 'The note is rolled back');
    equal(note.get('isDirty'), false, 'The note is not dirty');
  });
});


test('New note defaults', function() {
  expect(5);
  click(buttons.noteAdd);

  andThen(function() {
    var parent = lookups.currentModel().get('notes.content'),
        note = parent.get('firstObject');

    equal(parent.length, 1, 'An note is added to the parent');
    equal(note.get('isDirty'), true, 'A dirty object is created');
    equal(isEmpty(note.get('created_at')), false, 'There is a date in created_at');
    equal(isEmpty(note.get('updated_at')), false, 'There is a date in updated_at');
    equal(isEmpty(note.get('last_user')), false, 'There is a current_user');
  });
});
