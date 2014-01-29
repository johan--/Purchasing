
module('MakeParentDirty', {
  setup: function() {
    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');
  },

  teardown: function() {
  }
});


test('LineItem can make purchase dirty', function(){
  var model = helperMethods.model(),
      line = helperMethods.createLine();

  equal(model.get('isDirty'), false, 'The model starts out not dirty');
  equal(line.get('isDirty'), false, 'The line starts out not dirty');

  Ember.run(function(){
    line.send('becomeDirty');
  });

  andThen(function(){
    equal(model.get('isDirty'), true, 'The model became dirty');
    equal(line.get('isDirty'), true, 'The line became dirty');
  });
});


test('Note can make purchase dirty', function(){
  var model = helperMethods.model(),
      note = helperMethods.createNote();

  equal(model.get('isDirty'), false, 'The model starts out not dirty');
  equal(note.get('isDirty'), false, 'The note starts out not dirty');

  Ember.run(function(){
    note.send('becomeDirty');
  });

  andThen(function(){
    equal(model.get('isDirty'), true, 'The model became dirty');
    equal(note.get('isDirty'), true, 'The note became dirty');
  });
});


test('Receiving will not make purchase dirty', function(){
  var model = helperMethods.model(),
      line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line);

  equal(model.get('isDirty'), false, 'The model starts out not dirty');
  equal(rec.get('isDirty'), false, 'The rec starts out not dirty');

  Ember.run(function(){
    rec.send('becomeDirty');
  });

  andThen(function(){
    equal(model.get('isDirty'), false, 'The model did not become dirty');
    equal(rec.get('isDirty'), true, 'The rec became dirty');
  });
});


test('Receiving line will make receiving but not lineItem dirty', function(){
  var model = helperMethods.model(),
      line = helperMethods.createLine(),
      rec = helperMethods.createReceiving(line),
      recLine = rec.get('receivingLines.firstObject');

  equal(rec.get('isDirty'), false, 'The rec starts out not dirty');
  equal(line.get('isDirty'), false, 'The line starts out not dirty');
  equal(recLine.get('isDirty'), false, 'The recLine starts out not dirty');

  Ember.run(function(){
    recLine.send('becomeDirty');
  });

  andThen(function(){
    equal(rec.get('isDirty'), true, 'The rec became dirty');
    equal(line.get('isDirty'), false, 'The line did not become dirty');
    equal(recLine.get('isDirty'), true, 'The recLine became dirty');
  });
});

// No test for Tags, they work differently.  See integration/purchase/tags:30
// No test for Accounts, they work differently.  See integration/accounts/tags:108 & :275
