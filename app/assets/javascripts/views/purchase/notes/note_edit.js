
App.NoteEditView = Ember.View.extend(App.DeleteableViewMixin, {
  tagName: 'tr',
  templateName: 'purchase/notes/item_edit',

  classNames: ['note']
});
