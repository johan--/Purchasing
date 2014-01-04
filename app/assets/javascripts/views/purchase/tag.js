
App.TagView = Ember.View.extend({
  templateName: 'purchase/tag',

  tagName: 'span',
  classNames: ['small_tag'],
  classNameBindings: ['isDeleted:hidden'],


  click: function() {
    // TODO: Test for permission!
    this.get('controller').send('deleteRecord', this.$());
  },


  isDeleted: function() {
    return this.get('controller.model.isDestroy') === true;
  }.property('controller.model.isDestroy'),
});
