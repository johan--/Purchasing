
App.NoteView = Ember.View.extend(App.DeleteableViewMixin, {
  tagName: 'tr',
  templateName: 'purchase/notes/item',

  classNames: ['note'],

  click: function() {
    this.get('controller').send('startEditing');
  }
});
