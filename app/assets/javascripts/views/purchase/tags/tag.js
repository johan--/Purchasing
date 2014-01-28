
App.TagView = Ember.View.extend({
  templateName: 'purchase/tags/item',

  tagName: 'span',
  classNames: ['small_tag'],
  classNameBindings: ['isDeleted:hidden'],


  click: function() {
    // TODO: Test for permission!
    var model = this.get('controller.model');
    model.set('isDestroy', true);
  },


  isDeleted: function() {
    return this.get('controller.model.isDestroy') === true;
  }.property('controller.model.isDestroy'),
});
