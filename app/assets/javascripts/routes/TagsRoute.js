App.TagsRoute = Ember.Route.extend({

  model: function() {
    return this.get('store').find('tag');
  }
});
