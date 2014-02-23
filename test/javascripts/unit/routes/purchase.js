
module('Unit - Routes - Purchase', {
  setup: function() {
    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);
  },

  teardown: function() {
  }
});


test('Sets isEdit on Edit / New and not Show', function(){
  expect(3);
  visit('/purchases/new').then(function(){
    equal(lookups.controller('purchase.new').get('isEditing'), true, 'New sets isEditing to true');

    return visit('/purchases/1/edit');
  }).then(function(){
    equal(lookups.controller('purchase.edit').get('isEditing'), true, 'Edit sets isEditing to true');

    return visit('/purchases/1/show');
  }).then(function(){
    equal(lookups.controller('purchase.show').get('isEditing'), false, 'Show sets isEditing to false');
  });
});


test('AddLines Unit test', function(){
  expect(1);
  visit('/purchases/1/edit').then(function(){
    var model = lookups.currentModel(),
        testRoute = lookups.route('purchase.edit');

    testRoute.addNewLineObjects(model);

    equal(model.get('lineItems.length'), 2, '1 Line item created by AddLines');
  });
});


test('Rollback of record & LineItems', function() {
  expect(4);
  var model, line, oldDate, oldQuantity;

  visit('/purchases/1/edit').then(function() {

    model = lookups.currentModel();
    line = fixtures.createLine();
    oldDate = model.get('dateReconciled');
    oldQuantity = line.get('quantity');

    Ember.run(function() {
      model.set('dateReconciled', '1/1/2014');
      line.set('quantity', '151');
    });

    return visit('/purchases/1/show');

  }).then(function() {

    equal(model.get('isDirty'), false, 'The model rolls back');
    equal(model.get('dateReconciled'), oldDate, 'The date is rolled back');

    equal(line.get('isDirty'), false, 'The line rolls back');
    equal(line.get('quantity'), oldQuantity, 'The quantity is rolled back');

  });
});


test('Rollback of record & Notes', function() {
  expect(4);
  var model, note, oldDate, oldText;

  visit('/purchases/1/edit').then(function() {

    model = lookups.currentModel();
    note = fixtures.createNote();
    oldDate = model.get('dateReconciled');
    oldText = note.get('text');

    Ember.run(function() {
      model.set('dateReconciled', '1/1/2014');
      note.set('text', '151');
    });

    return visit('/purchases/1/show');

  }).then(function() {

    equal(model.get('isDirty'), false, 'The model rolls back');
    equal(model.get('dateReconciled'), oldDate, 'The date is rolled back');

    equal(note.get('isDirty'), false, 'The note rolls back');
    equal(note.get('text'), oldText, 'The text is rolled back');

  });
});


test('Rollback of record & Tags', function() {
  expect(4);
  var model, tag, oldDate, oldName;

  visit('/purchases/1/edit').then(function() {

    model = lookups.currentModel();
    tag = fixtures.createTag();
    oldDate = model.get('dateReconciled');
    oldName = tag.get('name');

    Ember.run(function() {
      model.set('dateReconciled', '1/1/2014');
      tag.set('name', '151');
    });

    return visit('/purchases/1/show');

  }).then(function() {

    equal(model.get('isDirty'), false, 'The model rolls back');
    equal(model.get('dateReconciled'), oldDate, 'The date is rolled back');

    equal(tag.get('isDirty'), false, 'The tag rolls back');
    equal(tag.get('name'), oldName, 'The name is rolled back');

  });
});


test('Rollback of record & Receivings', function() {
  expect(6);
  var model, line, receiving, recLine, oldDate, oldPackageNum, oldReceivingQuantity;

  visit('/purchases/1/edit').then(function() {

    model = lookups.currentModel();
    line = fixtures.createLine();
    receiving = fixtures.createReceiving(line);
    recLine = receiving.get('receivingLines.firstObject');
    oldDate = model.get('dateReconciled');
    oldPackageNum = receiving.get('package_num');
    oldReceivingQuantity = recLine.get('quantity');

    Ember.run(function() {
      model.set('dateReconciled', '1/1/2014');
      receiving.set('package_num', '151');
      recLine.set('quantity', '555');
    });

    return visit('/purchases/1/show');

  }).then(function() {

    equal(model.get('isDirty'), false, 'The model rolls back');
    equal(model.get('dateReconciled'), oldDate, 'The date is rolled back');

    equal(receiving.get('isDirty'), false, 'The receiving rolls back');
    equal(receiving.get('package_num'), oldPackageNum, 'The package # is rolled back');

    equal(recLine.get('isDirty'), false, 'The receiving line rolls back');
    equal(recLine.get('quantity'), oldReceivingQuantity, 'The quantity is rolled back');

  });
});
