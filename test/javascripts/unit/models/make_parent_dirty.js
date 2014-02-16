
module('Unit - Models - MakeParentDirty', {
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


test('LineItem can make purchase dirty', function(){
  expect(4);
  var model = lookups.currentModel(),
      line = fixtures.createLine();

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


test('Note will not make purchase dirty', function(){
  expect(4);
  var model = lookups.currentModel(),
      note = fixtures.createNote();

  equal(model.get('isDirty'), false, 'The model starts out not dirty');
  equal(note.get('isDirty'), false, 'The note starts out not dirty');

  Ember.run(function(){
    note.send('becomeDirty');
  });

  andThen(function(){
    equal(model.get('isDirty'), false, 'The model did not become dirty');
    equal(note.get('isDirty'), true, 'The note became dirty');
  });
});


test('Receiving will not make purchase dirty', function(){
  expect(4);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line);

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
  expect(6);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(line),
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


test('Receiving line will make receiving dirty when clicking increment', function(){
  expect(4);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving();

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[1]); // Second line item since we created one

  andThen(function(){
    var recLineFromLine = line.get('receivingLines.firstObject'),
        recFromPur = model.get('receivings.firstObject'),
        recLineFromRec = recFromPur.get('receivingLines.firstObject');

    equal(!isEmpty(recLineFromLine), true, 'Receiving Line is accessible from Line Item');
    equal(!isEmpty(recFromPur), true, 'Receiving is accessible from purchase');
    equal(!isEmpty(recLineFromRec), true, 'Receiving Line is accessible from purchase');

    equal(recFromPur.get('isDirty'), true, 'Receiving document is dirty');
  });
});


test('Receiving line will make parent dirty even if it is changed when dirty', function() {
  expect(4);
  var model = lookups.currentModel(),
      line = fixtures.createLine(),
      rec = fixtures.createReceiving(),
      recLine = rec.get('receivingLines.firstObject');

  equal(rec.get('isDirty'), false, 'Receiving document starts not dirty');

  Ember.run(function(){
    recLine.send('becomeDirty');
  });

  equal(recLine.get('isDirty'), true, 'Receiving line starts dirty');

  click(find(buttons.receivingEdit)[0]);
  click(find(buttons.receivingPlus)[1]); // Second line item since we created one

  andThen(function(){
    equal(recLine.get('isDirty'), true, 'Receiving line stays dirty');
    equal(rec.get('isDirty'), true, 'Receiving document becomes dirty');
  });
});


// No test for Tags, they work differently.  See integration/purchase/tags:30
// No test for Accounts, they work differently.  See integration/accounts/tags:108 & :275
