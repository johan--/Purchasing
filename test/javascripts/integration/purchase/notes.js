
module('Notes', {
  setup: function() {

    // Build fixtures
    injectFixtures();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {

  }

});


test('Adding a new note', function(){
  expect(1);
  var el = find(buttons.noteText)[0];

  click(el);
  fillIn(el, 'Test Note');
  focusOut(el);

  andThen(function(){
    var model = currentModel();
    equal(model.get('notes.length'), 2, 'New note is added after adding one');
  });
});


test('updated_at & created_at autofill when you first type', function(){
  expect(2);
  var model = currentModel().get('notes.firstObject'),
      el = find(buttons.noteText)[0];

  fillIn(el, 'Testing');
  focusOut(el);

  andThen(function(){
    equal(Ember.isEmpty(model.get('updated_at')), false, 'Updated at is not empty');
    equal(Ember.isEmpty(model.get('created_at')), false, 'Created at is not empty');
  });
});


test('Updated_at but not created_at update when you type', function(){
  expect(2);
  var model = currentModel().get('notes.firstObject'),
      el = find(buttons.noteText)[0],
      date = moment().format(App.Globals.DATE_STRING);

  Ember.run(function(){
    model.set('updated_at', 'test');
    model.set('created_at', 'test');
  });

  fillIn(el, 'Testing');
  focusOut(el);

  andThen(function(){
    notEqual(model.get('updated_at'), 'test', 'Updated at is updated');
    equal(model.get('created_at'), 'test', 'Created at is not updated');
  });
});
