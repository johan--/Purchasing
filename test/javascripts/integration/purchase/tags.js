
module('Integration - Purchase - Tags', {
  setup: function() {

    // Build fixtures
    fixtures.reset();
    myMocks.clearMocks();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    visit('/purchases/1/edit');

    // Force tags to load into store (since in App they are preloaded)
    Ember.run(function() { lookups.store().find('tag'); });
  },

  teardown: function() {
  }

});


test('Tag select is showing', function() {
  expect(1);

  andThen(function() {
    isVisible(buttons.tagsSelect, 'Tag select should be visible');
  });
});


test('Changing the tag select will add a record', function() {
  expect(3);
  var model = lookups.currentModel(),
      select = find(buttons.tagsSelect);

  equal(model.get('tags.length'), 0, 'Initially the model has no tags');

  change(select, 1);

  andThen(function() {
    equal(model.get('tags.length'), 1, 'Changing the select adds a new tag');
    equal(model.get('isDirty'), true, 'Adding a tag flags the model as dirty');
  });
});


test('You cannot add a tag twice', function() {
  expect(1);
  var model = lookups.currentModel(),
      store = lookups.store(),
      select = find(buttons.tagsSelect);

  Ember.run(function() {
    model.get('tags').pushObject(store.recordForId('tag', 1));
  });

  change(select, 1);

  andThen(function() {
    equal(model.get('tags.length'), 1, 'Changing the select does not add a new tag');
  });
});


test('Clicking a tag flags it as deleted', function() {
  expect(3);
  var model = lookups.currentModel(),
      select = find(buttons.tagsSelect);

  change(select, 1);

  var tag_icon = find(buttons.tagIcons).first();
  click(tag_icon);

  andThen(function() {
    var tag = model.get('tags.firstObject');

    equal(tag.get('isDestroy'), true, 'Clicking a tag flags it for destruction');
    contains(tag_icon.attr('class'), 'hidden', 'A destroyed tag has the correct class');
    equal(model.get('isDirty'), true, 'Adding a tag flags the model as dirty');
  });
});
