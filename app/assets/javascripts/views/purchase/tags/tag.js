
App.TagView = Ember.View.extend({
  templateName: 'purchase/tags/item',

  tagName: 'span',
  classNames: ['small_tag'],
  classNameBindings: ['isDeleted:hidden', 'canDelete:deleteable'],

  showList: false,

  canDelete: function() {
    return this.get('context.can_delete') && this.get('controller.parentController.parentController.isEditing');
  }.property('context.can_delete', 'controller.parentController.parentController.isEditing'),


  click: function() {
    if (this.get('canDelete'))
      this.get('controller').send('removeTag', this.get('context'));
  },


  isDeleted: function() {
    return this.get('controller.model.isDestroy') === true;
  }.property('controller.model.isDestroy'),
});
