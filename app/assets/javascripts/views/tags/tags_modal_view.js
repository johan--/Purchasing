
App.TagModalView = Ember.View.extend({

  templateName: 'tags/tag_view',

  willDestroyElement: function() {
    this.$('.modal').modal('hide');
  }
});
