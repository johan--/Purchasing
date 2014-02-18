
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

// New Note appears on show and edit
// Add Note button opens modal
// Note validates text
// New, close, and note is removed from view
// Edit, close, and note is rolled back
// New save performs ajax
// New note defaults
