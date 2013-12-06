
App.TagView = Ember.View.extend({
  templateName: 'purchase/tag',
  tagName: 'span',
  classNameBindings: ['isDeleted:hidden'],


  isDeleted: function() {
    return this.get('controller.model.destroy') === true;
  }.property('controller.model.destroy'),


  actions: {

    deleteMe: function() {
      this.get('controller').send('deleteRecord', this.$());
    }
  }
});
