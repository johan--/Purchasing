
module('Tags', {
  setup: function() {

    // Build fixtures
    helperMethods.injectFixtures();
    mockResults.clearMockResults();

    App.reset();
    Ember.run(App, App.advanceReadiness);

    // Build metadata
    metadata = getMetadataFor('purchase');

    // Clear fixtures
    updateTestFixtures(App.Purchase, { datePurchased: null,
                                       buyer: null,
                                       dateReconciled: null,
                                       dateCancelled: null });
    visit('/purchases/1/edit');
  },

  teardown: function() {
  }

});

test('Tag select is showing', function(){
  andThen(function(){
    isVisible(buttons.tagsSelect, 'Tag select should be visible');
  });
});

test('Changing the tag select will add a record', function(){
  var model = helperMethods.model(),
      select = find(buttons.tagsSelect);

  equal(model.get('tags.length'), 0, 'Initially the model has no tags');

  change(select, 1);

  andThen(function(){
    equal(model.get('tags.length'), 1, 'Changing the select adds a new tag');
    equal(model.get('isDirty'), true, 'Adding a tag flags the model as dirty');
  });
});

test('You cannot add a tag twice', function(){
  var model = helperMethods.model(),
      store = model.get('store'),
      select = find(buttons.tagsSelect);

  Ember.run(function(){
    var tag = store.all('tag').get('firstObject');
    model.set('tags', tag);
  });

  change(select, 1);

  andThen(function(){
    equal(model.get('tags.length'), 1, 'Changing the select adds a new tag');
    equal(model.get('isDirty'), true, 'Adding a tag flags the model as dirty');
  });
});

test('Clicking a tag flags it as deleted', function(){
  var model = helperMethods.model(),
      select = find(buttons.tagsSelect);

  change(select, 1);

  var tag_icon = find(buttons.tagIcons).first();
  click(tag_icon);

  andThen(function(){
    var tag = model.get('tags.firstObject');

    equal(tag.get('isDestroy'), true, 'Clicking a tag flags it for destruction');
    contains(tag_icon.attr('class'), 'hidden', 'A destroyed tag has the correct class');
  });
});
