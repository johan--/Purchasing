
App.TagView = Ember.View.extend({
  templateName: 'purchase/tag',
  tagName: 'span',

  actions: {
    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
    }
  }
})
